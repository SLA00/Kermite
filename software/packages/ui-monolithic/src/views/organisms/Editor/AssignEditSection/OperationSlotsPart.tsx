import { css } from 'goober';
import { h } from 'qx';
import { IPlainOperationEditCardsViewModel } from '~/viewModels/Editor/OperationEditPartViewModel';
import { IOperationSlotsPartViewModel } from '~/viewModels/Editor/OperationSlotsPartViewModel';
import { OperationCard } from '~/views/elements/OperationCard';
import { OperationSlotCard } from '~/views/elements/OperationSlotCard';

const cssOerationSlotsPart = css`
  > * {
    margin: 2px;
  }
  > * + * {
    margin-top: 4px;
  }
  margin-right: 6px;

  .spacer {
    height: 10px;
  }
`;

export function OerationSlotsPart(props: {
  operationSlotsVM: IOperationSlotsPartViewModel;
  plainOperationEditCardsVM: IPlainOperationEditCardsViewModel;
}) {
  const { transparentEntry, blockEntry } = props.plainOperationEditCardsVM;

  return (
    <div css={cssOerationSlotsPart}>
      {props.operationSlotsVM.slots.map((slot, index) => (
        <OperationSlotCard
          key={index}
          text={slot.text}
          isCurrent={slot.isCurrent}
          setCurrent={slot.setCurrent}
        />
      ))}
      <div class="spacer" />
      <OperationCard model={blockEntry} />
      <OperationCard model={transparentEntry} />
    </div>
  );
}
