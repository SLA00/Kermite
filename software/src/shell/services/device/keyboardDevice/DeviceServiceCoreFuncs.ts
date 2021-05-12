import {
  ConfigStorageFormatRevision,
  delayMs,
  ProfileBinaryFormatRevision,
  RawHidMessageProtocolRevision,
} from '~/shared';
import { NumSystemParameters } from '~/shared/defs/SystemCommand';
import { generateRandomDeviceInstanceCode } from '~/shared/funcs/DomainRelatedHelpers';
import { Packets } from '~/shell/services/device/keyboardDevice/Packets';
import {
  ICustomParametersReadResponseData,
  IDeviceAttributesReadResponseData,
  IReceivedBytesDecodeResult,
  recievedBytesDecoder,
} from '~/shell/services/device/keyboardDevice/ReceivedBytesDecoder';
import { IDeviceWrapper } from './DeviceWrapper';

function checkDeviceRevisions(data: {
  projectReleaseBuildRevision: number;
  configStorageFormatRevision: number;
  profileBinaryFormatRevision: number;
  rawHidMessageProtocolRevision: number;
}) {
  const {
    configStorageFormatRevision,
    rawHidMessageProtocolRevision,
    profileBinaryFormatRevision,
  } = data;

  if (configStorageFormatRevision !== ConfigStorageFormatRevision) {
    throw new Error(
      `incompatible config storage revision (software:${ConfigStorageFormatRevision}, firmware:${configStorageFormatRevision})`,
    );
  }
  if (profileBinaryFormatRevision !== ProfileBinaryFormatRevision) {
    throw new Error(
      `incompatible config storage revision (software:${ProfileBinaryFormatRevision}, firmware:${profileBinaryFormatRevision})`,
    );
  }
  if (rawHidMessageProtocolRevision !== RawHidMessageProtocolRevision) {
    throw new Error(
      `incompatible message protocol revision (software:${RawHidMessageProtocolRevision}, firmware:${rawHidMessageProtocolRevision})`,
    );
  }
}

// function getDeviceInitialParameterValues(customDef: IProjectCustomDefinition) {
//   return generateNumberSequence(10).map((i) => {
//     const paramSpec = customDef.customParameterSpecs?.find(
//       (paramSpec) => paramSpec.slotIndex === i,
//     );
//     return paramSpec ? paramSpec.defaultValue : 1;
//     // 定義がないパラメタのデフォルト値は1とする。
//     // project.jsonでパラメタが定義されていない場合に基本的なオプションを設定値クリアで0にしてしまうと
//     // キーストローク出力/LED出力が無効化されてファームウェアが動作しているかどうかを判別できなくなるため
//   });
// }

async function queryDeviceOperation<T>(
  device: IDeviceWrapper,
  requestFrame: number[],
  handler: (decoded: IReceivedBytesDecodeResult) => T | undefined | false,
): Promise<T> {
  let result: T | undefined;
  const onData = (buf: Uint8Array) => {
    const decoded = recievedBytesDecoder(buf);
    if (decoded) {
      const res = handler(decoded);
      if (res) {
        result = res;
      }
    }
  };
  device.onData(onData);
  device.writeSingleFrame(requestFrame);

  let cnt = 0;
  // eslint-disable-next-line no-unmodified-loop-condition
  while (!result && cnt < 1000) {
    await delayMs(1);
    cnt++;
  }
  device.onData.remove(onData);
  if (!result) {
    throw new Error('device read data timeout');
  }
  return result;
}

async function readDeviceAttributes(
  device: IDeviceWrapper,
): Promise<IDeviceAttributesReadResponseData> {
  return await queryDeviceOperation(
    device,
    Packets.deviceAttributesRequestFrame,
    (res) => res.type === 'deviceAttributeResponse' && res.data,
  );
}

async function readDeviceCustomParameters(
  device: IDeviceWrapper,
): Promise<ICustomParametersReadResponseData> {
  return await queryDeviceOperation(
    device,
    Packets.customParametersBulkReadRequestFrame,
    (res) => res.type === 'custromParametersReadResponse' && res.data,
  );
}

function writeDeviceInstanceCode(device: IDeviceWrapper, code: string) {
  device.writeSingleFrame(
    Packets.makeDeviceInstanceCodeWriteOperationFrame(code),
  );
}

// function writeDeviceCustromParameters(
//   device: IDeviceWrapper,
//   initialParameters: number[],
// ) {
//   device.writeSingleFrame(
//     Packets.makeCustomParametersBulkWriteOperationFrame(initialParameters),
//   );
// }

export async function deviceSetupTask(
  device: IDeviceWrapper,
): Promise<{
  attrsRes: IDeviceAttributesReadResponseData;
  customParamsRes: ICustomParametersReadResponseData | undefined;
}> {
  let attrsRes = await readDeviceAttributes(device);
  checkDeviceRevisions(attrsRes);
  // console.log({ attrsRes });
  if (!attrsRes.deviceInstanceCode) {
    console.log('write device instance code');
    const code = generateRandomDeviceInstanceCode();
    writeDeviceInstanceCode(device, code);
    attrsRes = await readDeviceAttributes(device);
    if (!attrsRes.deviceInstanceCode) {
      throw new Error('failed to write device instance code');
    }
  }
  const customParamsRes = await readDeviceCustomParameters(device);
  if (customParamsRes.numParameters !== NumSystemParameters) {
    throw new Error('system parameters count mismatch');
  }
  // console.log({ customParamsRes });
  // if (!customParamsRes.isParametersInitialized) {
  //   const customDef = await projectResourceProvider.getProjectCustomDefinition(
  //     attrsRes.resourceOrigin,
  //     attrsRes.projectId,
  //     attrsRes.firmwareVariationName,
  //   );
  //   if (!customDef) {
  //     // throw new Error('cannot find custom parameter definition');
  //     console.log('cannot find custom parameter definition');
  //     return {
  //       attrsRes,
  //       customParamsRes: undefined,
  //     };
  //   }
  //   console.log(`writing initial custom parameters`);
  //   const parameterValues = getDeviceInitialParameterValues(customDef);
  //   writeDeviceCustromParameters(device, parameterValues);
  //   customParamsRes = await readDeviceCustomParameters(device);
  //   if (!customParamsRes.isParametersInitialized) {
  //     throw new Error('failed to write initial custom parameters');
  //   }
  // }
  return {
    attrsRes,
    customParamsRes,
  };
}

export function updateDeviceCustomParameterSingle(
  device: IDeviceWrapper,
  index: number,
  value: number,
) {
  device.writeSingleFrame(
    Packets.makeCustomParameterSignleWriteOperationFrame(index, value),
  );
}

export function sendSideBrainHidReport(
  device: IDeviceWrapper,
  report: number[],
) {
  if (report.length === 8) {
    console.log(JSON.stringify(report));
    const pk = Packets.makeSideBrainHidReportFrame(report);
    device.writeSingleFrame(pk);
  }
}

export function sendSideBrainMode(device: IDeviceWrapper, enabled: boolean) {
  console.log(`writeSideBrainMode ${enabled ? 1 : 0}`);
  if (!enabled) {
    const blankHidReport = [0, 0, 0, 0, 0, 0, 0, 0];
    sendSideBrainHidReport(device, blankHidReport);
  }
  device.writeSingleFrame(Packets.makeSideBrainModeSpecFrame(enabled));
}
