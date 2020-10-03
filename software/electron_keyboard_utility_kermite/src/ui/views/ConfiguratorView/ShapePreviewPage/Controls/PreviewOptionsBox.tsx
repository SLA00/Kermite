import { css } from 'goober';
import { h } from '~lib/qx';
import { IUiSettings } from '~ui/models/UiStatusModel';
import { reflectFieldChecked } from '~ui/views/base/FormHelpers';

interface IDisplayOptionSource {
  fieldKey: keyof IUiSettings;
  label: string;
}
const displayOptionsSource: IDisplayOptionSource[] = [
  {
    fieldKey: 'shapeViewShowKeyId',
    label: 'keyId'
  },
  {
    fieldKey: 'shapeViewShowKeyIndex',
    label: 'keyIndex'
  },
  {
    fieldKey: 'shapeViewShowBoundingBox',
    label: 'box'
  }
];

const cssPreviewOptionsBox = css`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 10px;
  }

  > div {
    > label {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;

      > span {
        display: inline-block;
        margin-left: 2px;
      }
    }
  }
`;

export function PreviewOptionsBox(props: { settings: IUiSettings }) {
  const { settings } = props;
  return (
    <div css={cssPreviewOptionsBox}>
      {displayOptionsSource.map((om) => (
        <div key={om.fieldKey}>
          <label>
            <input
              type="checkbox"
              checked={settings[om.fieldKey] as boolean}
              onChange={reflectFieldChecked(settings, om.fieldKey)}
            />
            <span>{om.label}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
