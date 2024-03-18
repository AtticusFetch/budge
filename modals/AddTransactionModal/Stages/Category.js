import { useCallback, useEffect, useState } from 'react';

import { CategoriesList } from '../../../components/CategoriesList';
import { StageWrapper } from '../../../components/ModalStageWrapper';
import { useUserContext, userActions } from '../../../context/User';
import { createCategory } from '../../../utils/plaidApi';
import AddCategoryModal from '../../AddCategoryModal';

const addNewCategory = {
  icon: 'plus',
  id: 'custom',
  name: 'Create',
  color: 'orange',
};

export const CategoryStage = (props) => {
  const {
    dispatch,
    state: { user },
  } = useUserContext();
  const { userCategories = [] } = props;
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const onCategoryModalClose = useCallback(() => {
    console.log('onCategoryModalClose');
    setIsCategoryModalVisible(false);
  }, []);

  const onCategoryModalShow = useCallback(() => {
    console.log('onCategoryModalShow');
    setIsCategoryModalVisible(true);
  }, []);

  const onSubmitNewCategory = useCallback(async (data) => {
    const updatedUser = await createCategory(data, user?.id);
    dispatch(userActions.update(updatedUser));
    onCategoryModalClose();
  }, []);

  const onItemPress = useCallback((category) => {
    if (category.id === addNewCategory.id) {
      onCategoryModalShow();

      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    const allCategories = [...props.categories, ...userCategories];
    allCategories.push(addNewCategory);
    setCategories(allCategories);
  }, [props.categories, userCategories]);

  return (
    <StageWrapper {...props.stageProps}>
      <CategoriesList
        categories={categories}
        onSelectedCategoryChange={props.onChange}
        category={props.category}
        onItemPress={onItemPress}
      />
      <AddCategoryModal
        visible={isCategoryModalVisible}
        onClose={onCategoryModalClose}
        onSubmit={onSubmitNewCategory}
      />
    </StageWrapper>
  );
};
