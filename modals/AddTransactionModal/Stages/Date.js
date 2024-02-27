import { DatePicker } from '../../../components/DatePicker';
import { StageWrapper } from '../../../components/ModalStageWrapper';

export const DateStage = (props) => {
  return (
    <StageWrapper {...props.stageProps}>
      <DatePicker value={props.date} onChange={props.onChange} />
    </StageWrapper>
  );
};
