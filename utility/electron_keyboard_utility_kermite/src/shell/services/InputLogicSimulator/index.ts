import { IProfileManagerStatus } from '~contract/data';
import { IRealtimeKeyboardEvent } from '~contract/ipc';
import { appGlobal } from '../appGlobal';
import {
  completeEditModelForShiftLayer,
  createKeyIndexToKeyUnitIdTable
} from './EditModelFixer';
import { VirtualKeyStateManager2 } from './VirtualStateManager2';
import { VirtualStateManager } from './VirtualStateManager';
import { IModelKeyAssignsProvider } from './Types';
import { LogicalKeyActionDriver } from './LogicalKeyActionDriver';
import { HidKeyCodes } from '~model/HidKeyCodes';
import { OutputKeyPrioritySorter } from './OutputKeyPrioritySorter';
import { IntervalTimerWrapper } from './IntervalTimerWrapper';

const modifierBitPositionMap: {
  [hidKeyCode: number]: number;
} = {
  [HidKeyCodes.K_LCtrl]: 0,
  [HidKeyCodes.K_LShift]: 1,
  [HidKeyCodes.K_LAlt]: 2,
  [HidKeyCodes.K_LOS]: 3,
  [HidKeyCodes.K_RCtrl]: 4,
  [HidKeyCodes.K_RShift]: 5,
  [HidKeyCodes.K_RAlt]: 6,
  [HidKeyCodes.K_ROS]: 7
};

export class InputLogicSimulator {
  private keyAssignsProvider: IModelKeyAssignsProvider = {
    keyAssigns: {},
    keyUnitIdTable: []
  };

  private outputKeyPrioritySorter = new OutputKeyPrioritySorter();

  private sorterIntervalTimer = new IntervalTimerWrapper();

  private modifierBits: number = 0;

  private updateSideBrainHidReport = (ev: {
    hidKeyCode: number;
    isDown: boolean;
  }) => {
    const { hidKeyCode, isDown } = ev;
    // console.log(`    updateSideBrainHidReport ${hidKeyCode} ${isDown}`);
    let outKeyCode = 0;
    if (modifierBitPositionMap[hidKeyCode] !== undefined) {
      const bitPos = modifierBitPositionMap[hidKeyCode];
      if (isDown) {
        this.modifierBits |= 1 << bitPos;
      } else {
        this.modifierBits &= ~(1 << bitPos);
      }
      const report = [this.modifierBits, 0, 0, 0, 0, 0, 0, 0];
      appGlobal.deviceService.writeSideBrainHidReport(report);
    } else {
      outKeyCode = isDown ? hidKeyCode : 0;
    }

    const report = [this.modifierBits, 0, outKeyCode, 0, 0, 0, 0, 0];
    console.log(report);
    appGlobal.deviceService.writeSideBrainHidReport(report);
  };

  private onProfileManagerStatusChanged = (
    changedStatus: Partial<IProfileManagerStatus>
  ) => {
    if (changedStatus.loadedEditModel) {
      const editModel = completeEditModelForShiftLayer(
        changedStatus.loadedEditModel
      );
      this.keyAssignsProvider = {
        keyAssigns: editModel.keyAssigns,
        keyUnitIdTable: createKeyIndexToKeyUnitIdTable(editModel)
      };
    }
  };

  private onRealtimeKeyboardEvent = (event: IRealtimeKeyboardEvent) => {
    if (event.type === 'keyStateChanged') {
      const { keyIndex, isDown } = event;
      console.log(`key ${keyIndex} ${isDown ? 'down' : 'up'}`);

      const mode: number = 1;

      if (mode === 0) {
        VirtualStateManager.handleHardwareKeyStateEvent(
          keyIndex,
          isDown,
          this.keyAssignsProvider
        );
      } else if (mode === 1) {
        VirtualKeyStateManager2.handleHardwareKeyStateEvent(
          keyIndex,
          isDown,
          this.keyAssignsProvider
        );
      }
    }
    if (event.type === 'layerChanged') {
      console.log(`layer ${event.layerIndex}`);
    }
  };

  async initialize() {
    appGlobal.profileManager.subscribeStatus(
      this.onProfileManagerStatusChanged
    );
    appGlobal.deviceService.subscribe(this.onRealtimeKeyboardEvent);

    LogicalKeyActionDriver.setKeyDestinationProc(ev => {
      this.outputKeyPrioritySorter.pushInputEvent({
        hidKeyCode: ev.keyCode,
        isDown: ev.isDown,
        tick: Date.now()
      });
    });
    VirtualKeyStateManager2.start();

    appGlobal.deviceService.writeSideBrainMode(true);

    this.outputKeyPrioritySorter.setDesinationProc(
      this.updateSideBrainHidReport
    );

    this.sorterIntervalTimer.start(
      () => this.outputKeyPrioritySorter.processUpdate(),
      10
    );
  }

  async terminate() {
    appGlobal.deviceService.unsubscribe(this.onRealtimeKeyboardEvent);

    appGlobal.deviceService.writeSideBrainMode(false);

    this.sorterIntervalTimer.stop();
  }
}
