import { IProfileManagerStatus, IRealtimeKeyboardEvent } from '~defs/ipc';
import { appGlobal } from '../appGlobal';
import { IInputLogicSimulator } from '../InputLogicSimulator.interface';
import { IntervalTimerWrapper } from '../InputLogicSimulator/IntervalTimerWrapper';
import { logicSimulatorStateC } from './LogicSimulatorCCommon';
import { ModuleW_HidReportOutputBuffer } from './ModuleW_HidReportOutputBuffer';
import { ModuleA_LogicModulesEntry } from './ModuleA_LogicModulesEntry';
import { ModuleN_KeyBindUpdator } from './ModuleN_KeyBindUpdator';

export class InputLogicSimulatorC implements IInputLogicSimulator {
  private tikerTimer = new IntervalTimerWrapper();
  private tikerTimer2 = new IntervalTimerWrapper();

  private onProfileStatusChanged = (
    changedStatus: Partial<IProfileManagerStatus>
  ) => {
    if (changedStatus.loadedEditModel) {
      logicSimulatorStateC.editModel = changedStatus.loadedEditModel;
    }
  };

  private onRealtimeKeyboardEvent = (event: IRealtimeKeyboardEvent) => {
    if (event.type === 'keyStateChanged') {
      const { keyIndex, isDown } = event;
      const ev0 = { keyIndex, isDown };
      ModuleA_LogicModulesEntry.processEvents(ev0);
    }
  };

  private processTicker = () => {
    ModuleA_LogicModulesEntry.processTicker();
    ModuleN_KeyBindUpdator.processUpdate();
  };

  private processOutputTicker = () => {
    ModuleW_HidReportOutputBuffer.processTicker();
  };

  async initialize() {
    appGlobal.profileManager.subscribeStatus(this.onProfileStatusChanged);
    appGlobal.deviceService.setSideBrainMode(true);
    appGlobal.deviceService.subscribe(this.onRealtimeKeyboardEvent);
    this.tikerTimer.start(this.processTicker, 10);
    this.tikerTimer2.start(this.processOutputTicker, 5);
  }

  async terminate() {
    appGlobal.deviceService.unsubscribe(this.onRealtimeKeyboardEvent);
    appGlobal.deviceService.setSideBrainMode(false);
    this.tikerTimer.stop();
    this.tikerTimer2.stop();
  }
}
