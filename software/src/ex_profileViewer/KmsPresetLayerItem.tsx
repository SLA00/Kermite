import { css, FC, jsx } from 'qx';
import { kmsColors } from '~/ex_profileViewer/KmsColors';
import { withStopPropagation } from '~/ui/common';

type Props = {
  layerName: string;
  isActive: boolean;
  onClick: () => void;
};

const style = css`
  color: ${kmsColors.layerButtonText};
  padding: 0 4px;
  user-select: none;
  cursor: pointer;

  height: 34px;
  border: solid 1px ${kmsColors.layerButton};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-size: 14px;

  &[data-active] {
    background: ${kmsColors.layerButton};
  }
  &:hover {
    opacity: 0.7;
  }
`;

export const KmsPresetLayerItem: FC<Props> = ({
  layerName,
  isActive,
  onClick,
}) => (
  <div
    css={style}
    onClick={withStopPropagation(onClick)}
    data-active={isActive}
  >
    {layerName}
  </div>
);
