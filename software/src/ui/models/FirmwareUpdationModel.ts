import { appUi, backendAgent } from '~ui/core';

type FirmwareUpdationPhase =
  | 'WaitingReset'
  | 'WaitingUploadOrder'
  | 'Uploading'
  | 'UploadSuccess'
  | 'UploadFailure';

class FirmwareUpdationModel {
  firmwareNames: string[] = [];
  phase: FirmwareUpdationPhase = 'WaitingReset';
  comPortName: string | undefined = undefined;
  firmwareUploadResult: string | undefined = undefined;

  async uploadFirmware(firmwareName: string) {
    if (this.phase === 'WaitingUploadOrder' && this.comPortName) {
      this.phase = 'Uploading';
      appUi.rerender();
      const res = await backendAgent.uploadFirmware(
        firmwareName,
        this.comPortName
      );
      this.firmwareUploadResult = res;
      if (res === 'ok') {
        this.phase = 'UploadSuccess';
      } else {
        this.phase = 'UploadFailure';
      }
      appUi.rerender();
    }
  }

  private onComPortPlugEvent = ({
    comPortName
  }: {
    comPortName: string | undefined;
  }) => {
    this.comPortName = comPortName;
    if (this.phase === 'WaitingReset' && this.comPortName) {
      this.phase = 'WaitingUploadOrder';
    }
    if (this.phase === 'WaitingUploadOrder' && !this.comPortName) {
      this.phase = 'WaitingReset';
    }
    appUi.rerender();
  };

  backToInitialPhase() {
    this.phase = 'WaitingReset';
  }

  startComPortListener() {
    backendAgent.comPortPlugEvents.subscribe(this.onComPortPlugEvent);
  }

  endComPortListener() {
    backendAgent.comPortPlugEvents.unsubscribe(this.onComPortPlugEvent);
  }

  initialize() {
    (async () => {
      this.firmwareNames = await backendAgent.getFirmwareNamesAvailable();
      appUi.rerender();
    })();
  }
}

export const firmwareUpdationModel = new FirmwareUpdationModel();
