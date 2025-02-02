import { jsx, css } from 'qx';
import {
  uiTheme,
  OperationButtonWithIcon,
  ProjectAttachmentFileSelectorModal,
} from '~/ui/common';
import { LayoutManagerMenu } from '~/ui/layouter-page/LayoutManagerMenu';
import { useLayoutManagerViewModel } from '~/ui/layouter-page/LayoutManagerViewModel';
import { makeLayoutSelectorModalViewModel } from '~/ui/layouter-page/ProjectLayoutSelectorModalViewModel';

const cssLayoutManagementBar = css`
  color: ${uiTheme.colors.clMainText};
  display: flex;
  padding: 6px;
  padding-bottom: 0;
  gap: 0 4px;

  > * {
    flex-shrink: 0;
  }

  > .targetDisplayArea {
    flex-grow: 1;
    border: solid 1px ${uiTheme.colors.clPrimary};
    display: flex;
    align-items: center;
    padding: 0 5px;
  }
`;

export const LayoutManagerTopBar = () => {
  const vm = useLayoutManagerViewModel();
  const modalVm = makeLayoutSelectorModalViewModel(vm);
  return (
    <div css={cssLayoutManagementBar}>
      <LayoutManagerMenu baseVm={vm} />
      <div class="targetDisplayArea">{vm.editSourceText}</div>
      <OperationButtonWithIcon
        icon="save"
        label="save"
        disabled={!vm.canOverwrite}
        onClick={vm.overwriteLayout}
      />
      {modalVm && <ProjectAttachmentFileSelectorModal vm={modalVm} />}
    </div>
  );
};
