import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { CategoryListItem } from '../CategoryListItem';

const splitIntoRows = (countPerRow, arr = []) => {
  const rows = [];
  for (let i = 0; i < arr.length; i += countPerRow) {
    const chunk = arr.slice(i, i + countPerRow);
    rows.push(chunk);
  }

  return rows;
};

const getCategoryId = (category) => {
  const id = category?.id || category?.name || category?.icon || category || '';

  return id;
};

export const CategoriesList = (props) => {
  const {
    categories,
    onSelectedCategoryChange,
    btnContainerStyle,
    canAddMore = false,
    btnContentStyle,
    btnStyle,
    columns = 3,
  } = props;
  const [selectedCategory, setSelectedCategory] = useState(
    props.category || null,
  );
  const [splitCategories, setSplitCategories] = useState([]);

  useEffect(() => {
    const newCategories = splitIntoRows(columns, categories);
    setSplitCategories(newCategories);
  }, [categories, canAddMore]);

  const onItemPress = useCallback(
    (category) => {
      props.onItemPress?.(category);
      if (getCategoryId(selectedCategory) === getCategoryId(category)) {
        setSelectedCategory(null);
        onSelectedCategoryChange(null);
      } else {
        setSelectedCategory(category);
        onSelectedCategoryChange(category);
      }
    },
    [onSelectedCategoryChange, selectedCategory],
  );
  return (
    <>
      <ScrollView style={styles.container}>
        {splitCategories.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((category) => (
              <CategoryListItem
                onPress={onItemPress}
                size="slim"
                btnStyle={btnStyle}
                btnContainerStyle={btnContainerStyle}
                btnContentStyle={btnContentStyle}
                key={getCategoryId(category)}
                selected={
                  getCategoryId(selectedCategory) === getCategoryId(category)
                }
                category={category}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: '80%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    maxWidth: '100%',
  },
});
