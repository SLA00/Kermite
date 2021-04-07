import { getProjectOriginAndIdFromSig } from '~/shared/funcs/DomainRelatedHelpers';
import { ISelectorSource } from '~/ui/common';
import { useDeviceStatusModel } from '~/ui/common/sharedModels/DeviceStatusModelHook';
import {
  IPresetSelectionModel,
  editSelectedProjectPreset,
} from '~/ui/preset-browser-page/models';

export interface IPresetSelectionSectionViewModel {
  projectSelectorSource: ISelectorSource;
  presetSelectorSource: ISelectorSource;
  isLinkButtonActive: boolean;
  linkButtonHandler(): void;
  editPresetButtonHandler(): void;
}

export function usePresetSelectionSectionViewModel(
  model: IPresetSelectionModel,
): IPresetSelectionSectionViewModel {
  const deviceStatusModel = useDeviceStatusModel();
  return {
    projectSelectorSource: model.projectSelectorSource,
    presetSelectorSource: model.presetSelectorSource,
    isLinkButtonActive:
      deviceStatusModel.isConnected &&
      deviceStatusModel.deviceAttrs?.projectId !==
        getProjectOriginAndIdFromSig(model.currentProjectKey || '').projectId,
    linkButtonHandler() {
      const deviceProjectId = deviceStatusModel.deviceAttrs?.projectId || '';
      model.selectProjectByProjectId(deviceProjectId);
    },
    editPresetButtonHandler() {
      editSelectedProjectPreset(
        model.currentProjectKey,
        model.currentPresetKey,
      );
    },
  };
}
