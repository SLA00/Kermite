import {
  generateNumberSequence,
  IKeyboardConfig,
  IKeyboardDeviceStatus,
  IntervalTimerWrapper,
  IProfileData,
  IProfileManagerStatus,
  IRealtimeKeyboardEvent,
  SystemParameter,
} from '~/shared';
import { withAppErrorHandler } from '~/shell/base/ErrorChecker';
import { KeyboardConfigProvider } from '~/shell/services/config/KeyboardConfigProvider';
import { KeyboardDeviceService } from '~/shell/services/device/keyboardDevice';
import { dataStorage } from '~/shell/services/keyboardLogic/inputLogicSimulatorD/DataStorage';
import { ProfileManager } from '~/shell/services/profile/ProfileManager';
import { getKeyboardCoreLogicInterface } from './KeyboardCoreLogicImplementation';
import { makeProfileBinaryData } from './ProfileDataBinaryPacker';

function compareArray(ar0: any[], ar1: any[]): boolean {
  return (
    ar0.length === ar1.length &&
    generateNumberSequence(ar0.length).every((i) => ar0[i] === ar1[i])
  );
}

function createTimeIntervalCounter() {
  let prevTick = Date.now();
  return () => {
    const tick = Date.now();
    const elapsedMs = tick - prevTick;
    prevTick = tick;
    return elapsedMs;
  };
}
export class InputLogicSimulatorD {
  private CL = getKeyboardCoreLogicInterface();
  private tickerTimer = new IntervalTimerWrapper();
  private isSimulatorMode: boolean = false;
  private isMuteMode: boolean = false;
  private layerActiveFlags: number = 0;
  private hidReportBytes: number[] = new Array(8).fill(0);

  private tickUpdator = createTimeIntervalCounter();

  constructor(
    private profileManager: ProfileManager,
    private keyboardConfigProvider: KeyboardConfigProvider,
    private deviceService: KeyboardDeviceService,
  ) {}

  private get simulationActive(): boolean {
    return this.isSimulatorMode && !this.isMuteMode;
  }

  private onRealtimeKeyboardEvent = (event: IRealtimeKeyboardEvent) => {
    if (event.type === 'keyStateChanged') {
      const { keyIndex, isDown } = event;
      if (this.simulationActive) {
        this.CL.keyboardCoreLogic_issuePhysicalKeyStateChanged(
          keyIndex,
          isDown,
        );
      } else {
        console.log(`${event.isDown ? 'keydown' : 'keyup'} ${event.keyIndex}`);
      }
    }
  };

  private onDeviceStatusEvent = (event: Partial<IKeyboardDeviceStatus>) => {
    const values = event.systemParameterValues;
    if (values) {
      const systemLayout = values[SystemParameter.SystemLayout];
      // const isSimulatorMode = values[SystemParameter.SimulatorMode] > 0;
      const wiringMode = values[SystemParameter.WiringMode];
      // console.log(`systemlayout: ${systemLayout}, wiringMode: ${wiringMode}`);
      this.CL.keyboardCoreLogic_setSystemLayout(systemLayout);
      this.CL.keyboardCoreLogic_setWiringMode(wiringMode);
    }
  };

  private processTicker = () => {
    const elapsedMs = this.tickUpdator();

    if (this.simulationActive) {
      this.CL.keyboardCoreLogic_processTicker(elapsedMs);

      const report = this.CL.keyboardCoreLogic_getOutputHidReportBytes();
      if (!compareArray(this.hidReportBytes, report)) {
        this.deviceService.writeSimulatorHidReport(report);
        this.hidReportBytes = report.slice(0);
      }
      const newLayerActiveFlags = this.CL.keyboardCoreLogic_getLayerActiveFlags();
      if (newLayerActiveFlags !== this.layerActiveFlags) {
        this.deviceService.emitRealtimeEventFromSimulator({
          type: 'layerChanged',
          layerActiveFlags: newLayerActiveFlags,
        });
        this.layerActiveFlags = newLayerActiveFlags;
      }
    }
  };

  private loadSimulationProfile(profile: IProfileData) {
    const bytes = makeProfileBinaryData(profile);
    dataStorage.writeBinaryProfileData(bytes);
    this.CL.keyboardCoreLogic_initialize();
  }

  private onProfileStatusChanged = (
    changedStatus: Partial<IProfileManagerStatus>,
  ) => {
    if (changedStatus.loadedProfileData) {
      this.loadSimulationProfile(changedStatus.loadedProfileData);
    }
  };

  private keyboardConfigHandler = (config: Partial<IKeyboardConfig>) => {
    const { isSimulatorMode, isMuteMode } = config;
    if (
      isSimulatorMode !== undefined &&
      this.isSimulatorMode !== isSimulatorMode
    ) {
      this.deviceService.setSimulatorMode(isSimulatorMode);
      this.isSimulatorMode = isSimulatorMode;
    }
    if (isMuteMode !== undefined && this.isMuteMode !== isMuteMode) {
      this.deviceService.setMuteMode(isMuteMode);
      this.isMuteMode = isMuteMode;
    }
  };

  postSimulationTargetProfile(profile: IProfileData) {
    this.loadSimulationProfile(profile);
  }

  initialize() {
    this.profileManager.statusEventPort.subscribe(this.onProfileStatusChanged);
    this.keyboardConfigProvider.keyboardConfigEventPort.subscribe(
      this.keyboardConfigHandler,
    );
    this.deviceService.realtimeEventPort.subscribe(
      this.onRealtimeKeyboardEvent,
    );
    this.deviceService.statusEventPort.subscribe(this.onDeviceStatusEvent);
    this.tickerTimer.start(
      withAppErrorHandler(
        this.processTicker,
        'InputLogicSimulatorD_processTicker',
      ),
      5,
    );
  }

  terminate() {
    this.profileManager.statusEventPort.unsubscribe(
      this.onProfileStatusChanged,
    );
    this.keyboardConfigProvider.keyboardConfigEventPort.unsubscribe(
      this.keyboardConfigHandler,
    );
    this.deviceService.realtimeEventPort.unsubscribe(
      this.onRealtimeKeyboardEvent,
    );
    this.deviceService.statusEventPort.unsubscribe(this.onDeviceStatusEvent);
    this.tickerTimer.stop();
  }
}
