import { css } from 'goober';
import { h } from 'qx';
import { useLocal } from '~/ui-common/helpers';

export function ClosableOverlay(props: {
  close: () => void;
  children: JSX.Element;
}) {
  const cssDiv = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  `;

  const downMousePos = useLocal({ x: -1, y: -1 });

  const onMouseDown = (e: MouseEvent) => {
    downMousePos.x = e.pageX;
    downMousePos.y = e.pageY;
  };
  const onMouseUp = (e: MouseEvent) => {
    if (e.pageX === downMousePos.x && e.pageY === downMousePos.y) {
      props.close();
    }
    downMousePos.x = -1;
    downMousePos.y = -1;
  };

  const onMouseUpInner = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div css={cssDiv} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <div onMouseUp={onMouseUpInner}>{props.children}</div>
    </div>
  );
}

export const CommonDialogFrame = (props: {
  caption?: string;
  children: any;
}) => {
  const cssLayerEditDialogPanel = css`
    background: #fff;
    border: solid 1px #ccc;
    min-width: 400px;
    /* min-height: 120px; */
    border-radius: 4px;
    overflow: hidden;
    border: solid 2px #8af;
  `;

  const cssTitleBar = css`
    background: #8af;
    color: #fff;
    height: 28px;
    display: flex;
    align-items: center;
    padding-left: 4px;
  `;

  const cssBody = css``;

  return (
    <div css={cssLayerEditDialogPanel}>
      <div css={cssTitleBar}>{props.caption}</div>
      <div css={cssBody}>{props.children}</div>
    </div>
  );
};

export const DialogContentRow = (props: { children: any }) => {
  const cssBody = css`
    margin: 10px 15px 0;
    color: #048;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    white-space: pre-wrap;
  `;
  return <div css={cssBody}>{props.children}</div>;
};

export const DialogButtonsRow = (props: { children: any }) => {
  const cssButtonsRow = css`
    margin: 10px 15px;
    display: flex;
    justify-content: flex-end;
    > * + * {
      margin-left: 10px;
    }
  `;
  return <div css={cssButtonsRow}>{props.children}</div>;
};

export const DialogButton = (props: { children: any; onClick: () => void }) => {
  const cssButton = css`
    min-width: 80px;
    height: 28px;
    font-size: 16px;
    padding: 0 4px;
    border: solid 1px #08f;
    cursor: pointer;
    background: #8af;
    color: #048;

    &:hover {
      opacity: 0.8;
    }
  `;
  return (
    <button css={cssButton} onClick={props.onClick} data-debug="hoge">
      {props.children}
    </button>
  );
};
