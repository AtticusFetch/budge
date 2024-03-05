import { CategoriesList } from '../../../components/CategoriesList';
import { StageWrapper } from '../../../components/ModalStageWrapper';

export const CategoryStage = (props) => {
  return (
    <StageWrapper {...props.stageProps}>
      <CategoriesList
        categories={props.categories}
        onSelectedCategoryChange={props.onChange}
        category={props.category}
      />
    </StageWrapper>
  );
};
