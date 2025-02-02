import { IAppErrorData } from '~/shared/defs/CustomErrors';
import { ICustromParameterSpec } from '~/shared/defs/CustomParameter';
import { IPersistKeyboardDesign } from '~/shared/defs/KeyboardDesign';
import { IGlobalSettings, IKeyboardConfig } from './ConfigTypes';
import { IProfileData } from './ProfileData';

export type IPresetType = 'blank' | 'preset';

export type IPresetSpec =
  | {
      type: 'blank';
      layoutName: string;
    }
  | {
      type: 'preset';
      presetName: string;
    };

export type IResourceOrigin = 'local' | 'online';

export type IFirmwareTargetDevice = 'atmega32u4' | 'rp2040';

export interface IProjectFirmwareInfo {
  variationName: string;
  targetDevice: IFirmwareTargetDevice;
  buildRevision: number;
  buildTimestamp: string;
}

export interface IProjectResourceInfo {
  sig: string; // ${origin}#${projectId}
  origin: IResourceOrigin;
  projectId: string;
  keyboardName: string;
  projectPath: string;
  presetNames: string[];
  layoutNames: string[];
  firmwares: IProjectFirmwareInfo[];
}

export interface IProjectCustomDefinition {
  customParameterSpecs?: ICustromParameterSpec[];
}

export interface IKeyboardDeviceInfo {
  path: string;
  portName: string;
  projectId: string;
  deviceInstanceCode: string;
}

export interface IDeviceSelectionStatus {
  allDeviceInfos: IKeyboardDeviceInfo[];
  currentDevicePath: string | 'none';
}

export interface IKeyboardDeviceAttributes {
  origin: IResourceOrigin;
  projectId: string;
  firmwareVariationName: string;
  firmwareBuildRevision: number;
  deviceInstanceCode: string;
  assignStorageCapacity: number;
  portName: string;
  mcuName: string;
}
export interface IKeyboardDeviceStatus {
  isConnected: boolean;
  deviceAttrs?: IKeyboardDeviceAttributes;
  systemParameterValues?: number[];
  systemParameterMaxValues?: number[];
}

export type IRealtimeKeyboardEvent =
  | {
      type: 'keyStateChanged';
      keyIndex: number;
      isDown: boolean;
    }
  | {
      type: 'layerChanged';
      layerActiveFlags: number;
    };

export type IAppWindowStatus = {
  isActive: boolean;
  isDevtoolsVisible: boolean;
  isMaximized: boolean;
  isWidgetAlwaysOnTop: boolean;
};

export type IProfileEditSource =
  | {
      type: 'NewlyCreated';
    }
  | {
      type: 'InternalProfile';
      profileName: string;
    }
  | {
      type: 'ExternalFile';
      filePath: string;
    };

export interface IProfileManagerStatus {
  editSource: IProfileEditSource;
  allProfileNames: string[];
  loadedProfileData: IProfileData;
}
export interface IProfileManagerCommand {
  creatProfile?: {
    name?: string;
    targetProjectOrigin: IResourceOrigin;
    targetProjectId: string;
    presetSpec: IPresetSpec;
  };
  createProfileExternal?: {
    profileData: IProfileData;
  };
  createProfileFromLayout?: {
    projectId: string;
    layout: IPersistKeyboardDesign;
  };
  loadProfile?: { name: string };
  saveCurrentProfile?: { profileData: IProfileData };
  deleteProfile?: { name: string };
  renameProfile?: { name: string; newName: string };
  copyProfile?: { name: string; newName: string };
  saveAsProjectPreset?: {
    projectId: string;
    presetName: string;
    profileData: IProfileData;
  };
  importFromFile?: { filePath: string };
  exportToFile?: { filePath: string; profileData: IProfileData };
  saveProfileAs?: { name: string; profileData: IProfileData };
}

export type ILayoutEditSource =
  | {
      type: 'NewlyCreated';
    }
  | {
      type: 'CurrentProfile';
    }
  | {
      type: 'File';
      filePath: string;
    }
  | {
      type: 'ProjectLayout';
      projectId: string;
      layoutName: string;
    };
export interface ILayoutManagerStatus {
  editSource: ILayoutEditSource;
  loadedDesign: IPersistKeyboardDesign;
  projectLayoutsInfos: IProjectLayoutsInfo[];
}

export type ILayoutManagerCommand =
  | {
      type: 'createNewLayout';
    }
  | {
      type: 'loadCurrentProfileLayout';
    }
  | {
      type: 'save';
      design: IPersistKeyboardDesign;
    }
  | {
      type: 'loadFromFile';
      filePath: string;
    }
  | {
      type: 'saveToFile';
      filePath: string;
      design: IPersistKeyboardDesign;
    }
  | {
      type: 'createForProject';
      projectId: string;
      layoutName: string;
    }
  | {
      type: 'loadFromProject';
      projectId: string;
      layoutName: string;
    }
  | {
      type: 'saveToProject';
      projectId: string;
      layoutName: string;
      design: IPersistKeyboardDesign;
    };

export interface IProjectLayoutsInfo {
  origin: IResourceOrigin;
  projectId: string;
  projectPath: string;
  keyboardName: string;
  layoutNames: string[];
}

export interface IServerPorfileInfo {
  id: string;
  profileName: string;
  userName: string;
  profileData: IProfileData;
}

export interface IApplicationVersionInfo {
  version: string;
}

export type IBootloaderType = 'avrCaterina' | 'rp2040uf2' | 'avrDfu';
export type IBootloaderDeviceDetectionStatus =
  | {
      detected: false;
    }
  | {
      detected: true;
      bootloaderType: IBootloaderType;
      targetDeviceSig: string;
    };
export interface IAppIpcContract {
  sync: {
    dev_debugMessage(message: string): void;
    // config_saveSettingsOnClosing?: IApplicationSettings;
    config_saveKeyboardConfigOnClosing(data: IKeyboardConfig): void;
  };
  async: {
    system_getApplicationVersionInfo(): Promise<IApplicationVersionInfo>;
    window_closeWindow(): Promise<void>;
    window_minimizeWindow(): Promise<void>;
    window_maximizeWindow(): Promise<void>;
    window_restartApplication(): Promise<void>;
    window_setDevToolVisibility(visible: boolean): Promise<void>;
    window_setWidgetAlwaysOnTop(enabled: boolean): Promise<void>;
    window_reloadPage(): Promise<void>;

    profile_getCurrentProfile(): Promise<IProfileData>;
    profile_getAllProfileNames(): Promise<string[]>;
    profile_executeProfileManagerCommands(
      commands: IProfileManagerCommand[],
    ): Promise<void>;
    profile_openUserProfilesFolder(): Promise<void>;

    layout_executeLayoutManagerCommands(
      commands: ILayoutManagerCommand[],
    ): Promise<boolean>;

    layout_showEditLayoutFileInFiler(): Promise<void>;
    // layout_getAllProjectLayoutsInfos(): Promise<IProjectLayoutsInfo[]>;

    config_writeKeyboardConfig(config: Partial<IKeyboardConfig>): Promise<void>;
    config_writeKeyMappingToDevice(): Promise<boolean>;

    config_getGlobalSettings(): Promise<IGlobalSettings>;
    config_writeGlobalSettings(settings: IGlobalSettings): Promise<void>;
    config_getProjectRootDirectoryPath(): Promise<string>;

    projects_getAllProjectResourceInfos(): Promise<IProjectResourceInfo[]>;
    projects_getProjectCustomDefinition(
      origin: IResourceOrigin,
      projectId: string,
      variationName: string,
    ): Promise<IProjectCustomDefinition | undefined>;
    projects_loadPresetProfile(
      origin: IResourceOrigin,
      projectId: string,
      presetSpec: IPresetSpec,
    ): Promise<IProfileData | undefined>;
    projects_loadKeyboardShape(
      origin: IResourceOrigin,
      projectId: string,
      layoutName: string,
    ): Promise<IPersistKeyboardDesign | undefined>;

    presetHub_getServerProjectIds(): Promise<string[]>;
    presetHub_getServerProfiles(
      projectId: string,
    ): Promise<IServerPorfileInfo[]>;

    device_connectToDevice(path: string): Promise<void>;
    device_setCustomParameterValue(index: number, value: number): Promise<void>;
    device_resetParaemters(): Promise<void>;

    firmup_uploadFirmware(
      origin: IResourceOrigin,
      projectId: string,
      variationName: string,
    ): Promise<string>;

    file_getOpenJsonFilePathWithDialog(): Promise<string | undefined>;
    file_getSaveJsonFilePathWithDialog(): Promise<string | undefined>;
    file_loadObjectFromJsonWithFileDialog(): Promise<any | undefined>;
    file_saveObjectToJsonWithFileDialog(obj: any): Promise<boolean>;
    file_getOpenDirectoryWithDialog(): Promise<string | undefined>;

    simulator_postSimulationTargetProfile(profile: IProfileData): Promise<void>;

    platform_openUrlInDefaultBrowser(path: string): Promise<void>;

    global_triggerLazyInitializeServices(): Promise<void>;
  };
  events: {
    dev_testEvent: { type: string };
    global_appErrorEvents: IAppErrorData<any>;
    window_appWindowStatus: Partial<IAppWindowStatus>;
    profile_profileManagerStatus: Partial<IProfileManagerStatus>;
    layout_layoutManagerStatus: Partial<ILayoutManagerStatus>;

    device_deviceSelectionEvents: Partial<IDeviceSelectionStatus>;
    device_keyEvents: IRealtimeKeyboardEvent;
    device_keyboardDeviceStatusEvents: Partial<IKeyboardDeviceStatus>;

    firmup_deviceDetectionEvents: IBootloaderDeviceDetectionStatus;
    projects_layoutFileUpdationEvents: { projectId: string };

    config_keyboardConfigEvents: Partial<IKeyboardConfig>;
  };
}
