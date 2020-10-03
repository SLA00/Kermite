import { css } from 'goober';
import { h } from '~lib/qx';
import { uiTheme } from '~ui/core';
import { DeviceControlSection } from './DeviceControlSection';
import { KeyAssignEditPage } from './KeyAssignEditPage';
import { ProfileConfigratuionModalLayer } from './ProfileConfigurationPart';
import { ProfileManagementPart } from './ProfilesSection/ProfileManagementPart';

export function EditorPage() {
  const cssEditorPage = css`
    height: 100%;
    display: flex;
    flex-direction: column;

    > .topRow {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      background: ${uiTheme.colors.clPanelBox};
      height: 40px;
      align-items: center;
    }

    > .mainRow {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      > * {
        flex-grow: 1;
      }
    }
  `;

  return (
    <div css={cssEditorPage}>
      <div className="topRow">
        <ProfileManagementPart />
        <DeviceControlSection />
      </div>
      <div className="mainRow">
        <KeyAssignEditPage />
      </div>
      <ProfileConfigratuionModalLayer />
    </div>
  );
}
