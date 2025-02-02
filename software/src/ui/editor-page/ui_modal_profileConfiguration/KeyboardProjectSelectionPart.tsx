import { css, jsx } from 'qx';
import { uniqueArrayItemsByField } from '~/shared';
import {
  GeneralSelector,
  ISelectorOption,
  texts,
  useProjectResourceInfos,
} from '~/ui/common';
import { editorModel } from '~/ui/editor-page/models/EditorModel';

const cssAttrsRow = css`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 10px;
  }
`;

function makeTargetProjectSelectOptions(): ISelectorOption[] {
  const projectInfos = useProjectResourceInfos('projectsSortedByKeyboardName');
  const options: ISelectorOption[] = uniqueArrayItemsByField(
    projectInfos,
    'projectId',
  ).map((it) => ({ label: it.keyboardName, value: it.projectId }));

  const originalProjectId = editorModel.loadedPorfileData.projectId;
  if (
    originalProjectId &&
    !options.find((it) => it.value === originalProjectId)
  ) {
    options.push({
      label: `unknown(${originalProjectId})`,
      value: originalProjectId,
    });
  }
  options.push({ label: 'unspecified', value: '' });

  return options;
}

export const KeyboardProjectSelectionPart = () => {
  const options = makeTargetProjectSelectOptions();
  const value = editorModel.profileData.projectId || '';
  const setValue = editorModel.changeProjectId;

  return (
    <div css={cssAttrsRow}>
      <div data-hint={texts.hint_assigner_profileConfigModal_assignModel}>
        target project
      </div>
      <div>
        <GeneralSelector options={options} value={value} setValue={setValue} />
      </div>
    </div>
  );
};
