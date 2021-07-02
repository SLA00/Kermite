import { css, FC, jsx } from 'qx';
import { KmsPresetLayerItem } from '~/ex_profileViewer/KmsPresetLayerItem';
import { texts } from '~/ui/common';

type Props = {
  layers: {
    layerId: string;
    layerName: string;
  }[];
  currentLayerId: string;
  setCurrentLayerId(layerId: string): void;
};

const style = css`
  padding: 3px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  > * + * {
    margin-top: 7px;
  }
`;

export const KmsPresetLayersBox: FC<Props> = ({
  layers,
  currentLayerId,
  setCurrentLayerId,
}) => (
  <div
    css={style}
    data-hint={texts.hint_presetBrowser_layers}
    onClick={() => setCurrentLayerId('')}
  >
    {layers.reverse().map((la) => (
      <KmsPresetLayerItem
        key={la.layerId}
        layerName={la.layerName}
        isActive={la.layerId === currentLayerId}
        onClick={() => setCurrentLayerId(la.layerId)}
      />
    ))}
  </div>
);
