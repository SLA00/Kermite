import { FC, h, css } from 'qx';
import { uiTheme } from '~/ui-common';
import { ISelectorOption } from '~/ui-common/base';

interface Props {
  options: ISelectorOption[];
  value: string;
  setValue(value: string): void;
  buttonWidth?: number;
  className?: string;
  disabled?: boolean;
}

const style = (buttonWidth: number) => css`
  display: flex;

  > .strip {
    border: solid 1px ${uiTheme.colors.clPrimary};
    background: ${uiTheme.colors.clControlBase};
    color: ${uiTheme.colors.clPrimary};
    border-radius: ${uiTheme.controlBorderRadius}px;
    width: ${buttonWidth ? `${buttonWidth}px` : 'inherit'};
    height: ${uiTheme.unitHeight}px;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:not(:first-child) {
      border-left: none;
    }

    > .text {
      opacity: 0.7;
    }

    &[data-active] {
      background: ${uiTheme.colors.clPrimary};
      color: ${uiTheme.colors.clDecal};
      > .text {
        opacity: 1;
      }
    }

    &:hover {
      opacity: 0.7;
    }
  }

  &[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const RibbonSelector: FC<Props> = ({
  options,
  value,
  setValue,
  className,
  buttonWidth = 60,
  disabled,
}) => (
  <div css={style(buttonWidth)} class={className} data-disabled={disabled}>
    {options.map((item) => (
      <div
        key={item.value}
        class="strip"
        data-active={item.value === value}
        onClick={() => setValue(item.value)}
      >
        <span class="text">{item.label}</span>
      </div>
    ))}
  </div>
);
