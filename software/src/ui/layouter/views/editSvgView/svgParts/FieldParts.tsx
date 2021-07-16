import { jsx } from 'qx';
import { uiTheme } from '~/ui/common';
import { editReader } from '~/ui/layouter/models';
import { getGroupOuterSvgTransformSpec } from '~/ui/layouter/views/editSvgView/CoordHelpers';

function getWorldViewBounds() {
  const { sight } = editReader;
  const d = 1;
  const ew = (sight.screenW / 2) * sight.scale;
  const eh = (sight.screenH / 2) * sight.scale;
  const left = -ew + sight.pos.x + d;
  const top = -eh + sight.pos.y + d;
  const right = ew + sight.pos.x - d;
  const bottom = eh + sight.pos.y - d;
  return {
    left,
    top,
    right,
    bottom,
  };
}

export const FieldAxis = (props: { isGroupCoordAxis: boolean }) => {
  const { isGroupCoordAxis } = props;
  const { left, top, right, bottom } = getWorldViewBounds();

  const groupTransformSpec =
    (isGroupCoordAxis &&
      getGroupOuterSvgTransformSpec(editReader.currentTransGroupId, false)) ||
    undefined;

  return (
    <g transform={groupTransformSpec}>
      <line
        x1={left}
        y1={0}
        x2={right}
        y2={0}
        stroke={uiTheme.colors.clLayouterAxis}
        stroke-width={0.5}
      />
      <line
        x1={0}
        y1={top}
        x2={0}
        y2={bottom}
        stroke={uiTheme.colors.clLayouterAxis}
        stroke-width={0.5}
      />
    </g>
  );
};

function makeRange(lo: number, hi: number) {
  return new Array(hi - lo + 1).fill(0).map((_, i) => lo + i);
}

export const FieldGrid = () => {
  const { left, top, right, bottom } = getWorldViewBounds();
  const { x: gpx, y: gpy } = editReader.gridPitches;

  const nl = (left / gpx) >> 0;
  const nt = (top / gpy) >> 0;
  const nr = (right / gpx) >> 0;
  const nb = (bottom / gpy) >> 0;

  const xs = makeRange(nl, nr).map((ix) => ix * gpx);
  const ys = makeRange(nt, nb).map((iy) => iy * gpy);

  const groupTransformSpec = getGroupOuterSvgTransformSpec(
    editReader.currentTransGroupId,
    false,
  );

  return (
    <g transform={groupTransformSpec}>
      <g>
        {ys.map((y) => (
          <line
            key={y}
            x1={left}
            y1={y}
            x2={right}
            y2={y}
            stroke={uiTheme.colors.clLayouterGrid}
            stroke-width={0.5}
          />
        ))}
      </g>
      <g>
        {xs.map((x) => (
          <line
            key={x}
            x1={x}
            y1={top}
            x2={x}
            y2={bottom}
            stroke={uiTheme.colors.clLayouterGrid}
            stroke-width={0.5}
          />
        ))}
      </g>
    </g>
  );
};
