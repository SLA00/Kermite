import { Hook, jsx, asyncRerender, css } from 'qx';
import { editReader, editMutations } from '~/ui/layouter/models';
import { EditSvgView } from './EditSvgView';
import { DebugOverlay } from './overlays/DebugOverlay';
import { InformationOverlay } from './overlays/InformationOverlay';

export const EditSvgViewContainer = () => {
  const cssSvgView = css`
    flex-grow: 1;
    overflow: hidden;
    position: relative;
    > svg {
      position: absolute;
    }
  `;

  const { screenW, screenH } = editReader.sight;

  const ref = Hook.useRef<HTMLDivElement>();
  const baseEl = ref.current;
  if (baseEl) {
    const cw = baseEl.clientWidth;
    const ch = baseEl.clientHeight;
    if (!(cw === screenW && ch === screenH)) {
      editMutations.setEditScreenSize(cw, ch);
    }
  } else {
    asyncRerender();
  }

  return (
    <div css={cssSvgView} ref={ref}>
      <EditSvgView />
      <DebugOverlay />
      <InformationOverlay />
    </div>
  );
};
