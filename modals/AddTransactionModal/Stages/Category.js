import _ from 'lodash';
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
  const { userCategories } = props;
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const onCategoryModalClose = useCallback(() => {
    setIsCategoryModalVisible(false);
  }, []);

  const onCategoryModalShow = useCallback(() => {
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
    let allCategories = props.categories;
    if (userCategories?.length) {
      allCategories = [...props.categories, ...userCategories];
    }
    const sorted = _.sortBy(allCategories, 'name');
    sorted.unshift(addNewCategory);
    setCategories(sorted);
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
