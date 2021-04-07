import { IPresetSpec, IProjectResourceInfo } from '~/shared';
import { createPresetKey } from '~/shared/funcs/DomainRelatedHelpers';
import {
  fieldSetter,
  getSelectionValueCorrected,
  ipcAgent,
  ISelectorOption,
  ISelectorSource,
  useFetcher,
  usePersistState,
} from '~/ui/common';

export interface IPresetSelectionModel {
  projectSelectorSource: ISelectorSource;
  presetSelectorSource: ISelectorSource;
  currentProjectKey: string;
  currentPresetKey: string;
  selectProjectByProjectId(projectId: string): void;
}

function makeProjectOptions(infos: IProjectResourceInfo[]): ISelectorOption[] {
  return infos.map((it) => ({
    value: it.sig,
    label: (it.origin === 'local' ? '[L]' : '[R]') + it.keyboardName,
  }));
}

type IPresetSelectorOption = ISelectorOption & {
  spec: IPresetSpec;
};

function makePresetOptions(
  resouceInfos: IProjectResourceInfo[],
  projectSig: string,
): IPresetSelectorOption[] {
  const projectInfo = resouceInfos.find((info) => info.sig === projectSig);
  if (!projectInfo) {
    return [];
  }
  return [
    ...projectInfo.layoutNames.map((layoutName) => ({
      value: createPresetKey('blank', layoutName),
      label: `[blank]${layoutName}`,
      spec: {
        type: 'blank' as const,
        layoutName,
      },
    })),
    ...projectInfo.presetNames.map((presetName) => ({
      value: createPresetKey('preset', presetName),
      label: `[preset]${presetName}`,
      spec: {
        type: 'preset' as const,
        presetName,
      },
    })),
  ];
}

export function usePresetSelectionModel(): IPresetSelectionModel {
  const sel = usePersistState(`presetSelecionModel__sel`, {
    projectKey: '', // ${origin}#${projectId}
    presetKey: '', // blank:${layoutName} or preset:${presetName}
  });

  const resourceInfos = useFetcher(
    ipcAgent.async.projects_getAllProjectResourceInfos,
    [],
  );
  const projectOptions = makeProjectOptions(resourceInfos);
  const presetOptions = makePresetOptions(resourceInfos, sel.projectKey);

  const modProjectKey = getSelectionValueCorrected(
    projectOptions,
    sel.projectKey,
  );
  const modPresetKey = getSelectionValueCorrected(presetOptions, sel.presetKey);

  const selectProject = (projectKey: string) => {
    sel.projectKey = projectKey;
    sel.presetKey = '';
  };

  const selectProjectByProjectId = (projectId: string) => {
    const info = resourceInfos.find((info) => info.projectId === projectId);
    if (info) {
      selectProject(info.sig);
    }
  };

  return {
    projectSelectorSource: {
      options: projectOptions,
      value: modProjectKey,
      setValue: selectProject,
    },
    presetSelectorSource: {
      options: presetOptions,
      value: modPresetKey,
      setValue: fieldSetter(sel, 'presetKey'),
    },
    currentProjectKey: modProjectKey,
    currentPresetKey: modPresetKey,
    selectProjectByProjectId,
  };
}
