import { IKeyboardDeviceStatus, IRealtimeKeyboardEvent } from '~/shared';
import { executeWithAppErrorHandler2 } from '~/shell/base/ErrorChecker';
import { createEventPort } from '~/shell/funcs';
import { getPortNameFromDevicePath } from '~/shell/services/device/keyboardDevice/DeviceEnumerator';
import {
  deviceSetupTask,
  readDeviceCustomParameters,
} from '~/shell/services/device/keyboardDevice/DeviceServiceCoreFuncs';
import { Packets } from '~/shell/services/device/keyboardDevice/Packets';
import {
  ICustomParametersReadResponseData,
  IDeviceAttributesReadResponseData,
  recievedBytesDecoder,
} from '~/shell/services/device/keyboardDevice/ReceivedBytesDecoder';
import { IDeviceWrapper } from './DeviceWrapper';

function createConnectedStatus(
  devicePath: string,
  attrsRes: IDeviceAttributesReadResponseData,
  custromParamsRes: ICustomParametersReadResponseData | undefined,
): IKeyboardDeviceStatus {
  return {
    isConnected: true,
    deviceAttrs: {
      origin: attrsRes.resourceOrigin,
      projectId: attrsRes.projectId,
      firmwareVariationName: attrsRes.firmwareVariationName,
      firmwareBuildRevision: attrsRes.projectReleaseBuildRevision,
      deviceInstanceCode: attrsRes.deviceInstanceCode,
      assignStorageCapacity: attrsRes.assignStorageCapacity,
      portName: getPortNameFromDevicePath(devicePath) || devicePath,
      mcuName: attrsRes.firmwareMcuName,
    },
    systemParameterValues: custromParamsRes?.parameterValues,
    systemParameterMaxValues: custromParamsRes?.parameterMaxValues,
  };
}

export class KeyboardDeviceServiceCore {
  realtimeEventPort = createEventPort<IRealtimeKeyboardEvent>();

  private device: IDeviceWrapper | undefined;

  private deviceStatus: IKeyboardDeviceStatus = {
    isConnected: false,
  };

  statusEventPort = createEventPort<Partial<IKeyboardDeviceStatus>>({
    initialValueGetter: () => this.deviceStatus,
  });

  private setStatus(newStatus: Partial<IKeyboardDeviceStatus>) {
    this.deviceStatus = { ...this.deviceStatus, ...newStatus };
    this.statusEventPort.emit(newStatus);
  }

  private onDeviceDataReceived = (buf: Uint8Array) => {
    const res = recievedBytesDecoder(buf);
    if (res?.type === 'realtimeEvent') {
      this.realtimeEventPort.emit(res.event);
    }
    if (res?.type === 'parameterChangedNotification') {
      const newValues = this.deviceStatus.systemParameterValues!.slice();
      newValues[res.parameterIndex] = res.value;
      this.setStatus({
        systemParameterValues: newValues,
      });
    }
  };

  private async loadDeviceInfo(device: IDeviceWrapper) {
    const setupRes = await deviceSetupTask(device);
    // console.log({ res: setupRes });
    if (setupRes) {
      this.setStatus(
        createConnectedStatus(
          device.connectedDevicePath!,
          setupRes.attrsRes,
          setupRes.customParamsRes,
        ),
      );
    }
  }

  private clearDevice = () => {
    this.setStatus({
      isConnected: false,
      deviceAttrs: undefined,
      systemParameterValues: undefined,
      systemParameterMaxValues: undefined,
    });
    this.device = undefined;
  };

  setCustomParameterValue(index: number, value: number) {
    this.device?.writeSingleFrame(
      Packets.makeCustomParameterSignleWriteOperationFrame(index, value),
    );
  }

  resetParameters() {
    executeWithAppErrorHandler2(async () => {
      if (this.device) {
        this.device.writeSingleFrame(Packets.customParametersResetRequestFrame);
        const customParamsRes = await readDeviceCustomParameters(this.device);
        this.setStatus({
          systemParameterValues: customParamsRes.parameterValues,
        });
      }
    });
  }

  setDeivce(device: IDeviceWrapper | undefined) {
    this.clearDevice();
    if (device) {
      device.onData(this.onDeviceDataReceived);
      device.onClosed(this.clearDevice);
      executeWithAppErrorHandler2(() => this.loadDeviceInfo(device));
    }
    this.device = device;
  }

  setSimulatorMode(enabled: boolean) {
    this.device?.writeSingleFrame(Packets.makeSimulatorModeSpecFrame(enabled));
  }

  writeSimulatorHidReport(report: number[]) {
    if (this.device) {
      if (report.length === 8) {
        console.log(JSON.stringify(report));
        const pk = Packets.makeSimulatorHidReportFrame(report);
        this.device.writeSingleFrame(pk);
      }
    }
  }

  setMuteMode(enabled: boolean) {
    this.device?.writeSingleFrame(Packets.makeMuteModeSpecFrame(enabled));
  }
}
