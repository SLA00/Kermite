import { h } from 'qx';
import { css } from 'qx/cssinjs';
import { uiTheme } from '~/ui-common';

const cssButton = css`
  font-size: 16px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;

  &[data-disabled] {
    opacity: 0.3;
    pointer-events: none;
  }
  color: ${uiTheme.colors.clMainText};
`;

export const LayerOperationButtton = (props: {
  icon: string;
  handler: () => void;
  enabled: boolean;
  hint: string;
}) => {
  return (
    <div
      css={cssButton}
      onClick={props.handler}
      data-disabled={!props.enabled}
      data-hint={props.hint}
    >
      <i className={props.icon} />
    </div>
  );
};
