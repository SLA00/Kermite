import { overwriteObjectProps } from '~funcs/Utils';
import { siteModel } from './zAppDomain';

export interface IUiSettings {
  showTestInputArea: boolean;
  page: 'editor' | 'shapePreview';
  shapeViewBreedName: string;
  shapeViewShowKeyId: boolean;
  shapeViewShowKeyIndex: boolean;
  shapeViewShowBoundingBox: boolean;
}

const defaultUiSettins: IUiSettings = {
  showTestInputArea: false,
  page: 'editor',
  shapeViewBreedName: '',
  shapeViewShowKeyId: false,
  shapeViewShowKeyIndex: false,
  shapeViewShowBoundingBox: false
};

export class UiStatusModel {
  readonly settings: IUiSettings = defaultUiSettins;

  initialize() {
    const settingsText = localStorage.getItem('uiSettings');
    if (settingsText) {
      const settings = JSON.parse(settingsText);
      overwriteObjectProps(this.settings, settings);
    }
    if (!siteModel.isDevelopment || !this.settings.page) {
      this.settings.page = 'editor';
    }
  }

  save() {
    const settingsText = JSON.stringify(this.settings);
    localStorage.setItem('uiSettings', settingsText);
  }

  finalize() {
    this.save();
  }
}
