import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

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
    columns = 2,
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
      const exit = props.onItemPress?.(category);
      if (exit) {
        return;
      }
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
    <FlatList
      data={splitCategories}
      style={styles.list}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => (
        <View key={index} style={styles.row}>
          {item.map((category) => (
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
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  list: {
    width: '100%',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    maxWidth: '100%',
  },
});
