import {
  IProfileManagerStatus,
  IRealtimeKeyboardEvent
} from '~defs/IpcContract';
import { services } from '..';
import { IInputLogicSimulator } from '../InputLogicSimulator.interface';
import { IntervalTimerWrapper } from '../InputLogicSimulator/IntervalTimerWrapper';
import {
  logicSimulatorStateC,
  createModuleFlow
} from './LogicSimulatorCCommon';
import { ModuleA_KeyIdReader } from './ModuleA_KeyIdReader';
import { ModuleC_InputTriggerDetector } from './ModuleC_InputTriggerDetector';
import { ModuleD_KeyInputAssignReader } from './ModuleD_KeyInputAssignReader';
import { ModuleF_KeyEventPrioritySorter } from './ModuleF_KeyEventPrioritySorter';
import { ModuleK_KeyStrokeAssignDispatcher } from './ModuleK_KeyStrokeAssignDispatcher';
import { ModuleN_VirtualKeyEventAligner } from './ModuleN_VirtualKeyEventAligner';
import { ModuleR_VirtualKeyBinder } from './ModuleR_VirtualKeyBinder';
import { ModuleT_OutputKeyStateCombiner } from './ModuleT_OutputKeyStateCombiner';
import { ModuleW_HidReportOutputBuffer } from './ModuleW_HidReportOutputBuffer';
import { delayMs } from '~funcs/Utils';

export namespace InputLogicSimulatorC {
  const tickerTimer = new IntervalTimerWrapper();

  function onProfileStatusChanged(
    changedStatus: Partial<IProfileManagerStatus>
  ) {
    if (changedStatus.loadedProfileData) {
      logicSimulatorStateC.profileData = changedStatus.loadedProfileData;
    }
  }

  async function hidReportExperiment() {
    services.deviceService.writeSideBrainHidReport([2, 0, 0, 30, 0, 0, 0, 0]);
    await delayMs(100);
    services.deviceService.writeSideBrainHidReport([0, 0, 0, 0, 0, 0, 0, 0]);
    await delayMs(100);
    services.deviceService.writeSideBrainHidReport([0, 0, 30, 0, 0, 0, 0, 0]);
    await delayMs(100);
    services.deviceService.writeSideBrainHidReport([0, 0, 0, 0, 0, 0, 0, 0]);
    await delayMs(100);
  }

  function onRealtimeKeyboardEvent(event: IRealtimeKeyboardEvent) {
    if (event.type === 'keyStateChanged') {
      const { keyIndex, isDown } = event;
      if (0) {
        //experiment
        if (isDown) {
          hidReportExperiment();
          return;
        }
      }
      ModuleA_KeyIdReader.io.push({ keyIndex, isDown });
    }
  }

  function setupWiring() {
    createModuleFlow(ModuleA_KeyIdReader.io)
      .chain(ModuleC_InputTriggerDetector.io)
      .chain(ModuleD_KeyInputAssignReader.io)
      .chain(ModuleF_KeyEventPrioritySorter.io)
      .chain(ModuleK_KeyStrokeAssignDispatcher.io)
      .chain(ModuleN_VirtualKeyEventAligner.io)
      .chain(ModuleR_VirtualKeyBinder.io)
      .chain(ModuleT_OutputKeyStateCombiner.io)
      .chain(ModuleW_HidReportOutputBuffer.io);
    ModuleW_HidReportOutputBuffer.io.chainTo((report) =>
      services.deviceService.writeSideBrainHidReport(report)
    );
  }

  function processTicker() {
    ModuleC_InputTriggerDetector.handleTicker();
    ModuleF_KeyEventPrioritySorter.processTicker();
    ModuleN_VirtualKeyEventAligner.processUpdate();
    ModuleW_HidReportOutputBuffer.processTicker();
  }

  async function initialize() {
    setupWiring();
    services.profileManager.subscribeStatus(onProfileStatusChanged);
    services.deviceService.setSideBrainMode(true);
    services.deviceService.subscribe(onRealtimeKeyboardEvent);
    tickerTimer.start(processTicker, 5);
  }

  async function terminate() {
    services.deviceService.writeSideBrainHidReport([0, 0, 0, 0, 0, 0, 0, 0]);
    services.deviceService.unsubscribe(onRealtimeKeyboardEvent);
    services.deviceService.setSideBrainMode(false);
    tickerTimer.stop();
  }

  export function getInterface(): IInputLogicSimulator {
    return {
      initialize,
      terminate
    };
  }
}
