import { backendAgent } from '../core/ipc';
import { IAppWindowEvent } from '~defs/IpcContract';
import { appUi } from '../core/appUi';

export class SiteModel {
  private _isWidgetMode: boolean = false;
  private _isWindowActive: boolean = true;

  get isWidgetMode() {
    return this._isWidgetMode;
  }

  get isWindowActive() {
    return this._isWindowActive;
  }

  setWidgetMode = (isWidgetMode: boolean) => {
    this._isWidgetMode = isWidgetMode;
    backendAgent.widgetModeChanged(isWidgetMode);
  };

  private onAppWindowEvents = (ev: IAppWindowEvent) => {
    if (ev.activeChanged !== undefined) {
      this._isWindowActive = ev.activeChanged;
      appUi.rerender();
    }
  };

  initialize() {
    backendAgent.appWindowEvents.subscribe(this.onAppWindowEvents);
  }

  finalize() {
    backendAgent.appWindowEvents.unsubscribe(this.onAppWindowEvents);
  }
}
