import { FC, h } from 'qx';
import { css } from 'qx/cssinjs';
import { uiTheme } from '~/ui-common';
import { Icon } from '~/ui-common/components/controls';

type IGeneralButtonSize = 'unit' | 'unitSquare' | 'large';

interface Props {
  text?: string;
  icon?: string;
  onClick?(): void;
  disabled?: boolean;
  className?: string;
  size?: IGeneralButtonSize;
  children?: any;
}

const style = css`
  background: ${uiTheme.colors.clPrimary};
  color: ${uiTheme.colors.clDecal};
  border-radius: ${uiTheme.controlBorderRadius}px;
  font-size: 15px;
  padding: 2px 4px;
  cursor: pointer;
  user-select: none;

  display: flex;
  justify-content: center;
  align-items: center;

  &[data-size='unit'] {
    height: ${uiTheme.unitHeight}px;
    padding: 2px 10px;
  }

  &[data-size='unitSquare'] {
    width: ${uiTheme.unitHeight}px;
    height: ${uiTheme.unitHeight}px;
  }

  &[data-size='large'] {
    height: 36px;
    font-size: 18px;
    padding: 2px 15px;
  }

  > :not(:first-child) {
    margin-left: 1px;
  }

  &:hover {
    opacity: 0.7;
  }

  &[data-disabled] {
    pointer-events: none;
    cursor: inherit;
    opacity: 0.3;
  }
`;

export const GeneralButton: FC<Props> = ({
  text,
  icon,
  onClick,
  disabled,
  className,
  size = 'unit',
  children,
}) => (
  <div
    css={style}
    className={className}
    onClick={onClick}
    data-disabled={disabled}
    data-size={size}
  >
    {icon && <Icon spec={icon} />}
    {text && <span>{text}</span>}
    {children}
  </div>
);
