import _ from 'lodash';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoryListItem } from '../CategoryListItem';

const splitIntoRows = (countPerRow, arr = []) => {
  const rows = [];
  for (let i = 0; i < arr.length; i += countPerRow) {
    const chunk = arr.slice(i, i + countPerRow);
    rows.push(chunk);
  }

  return rows;
};

const getCategoryId = (category) => category?.id || category?.name || category;

export const CategoriesList = (props) => {
  const { categories, onSelectedCategoryChange } = props;
  const [selectedCategory, setselectedCategory] = useState(null);
  const splitCategories = splitIntoRows(
    3,
    _.sortBy(categories, (c) => parseInt(c.id, 10)),
  );
  const onItemPress = useCallback(
    (category) => {
      if (getCategoryId(selectedCategory) === getCategoryId(category)) {
        setselectedCategory(null);
        onSelectedCategoryChange(null);
      } else {
        setselectedCategory(category);
        onSelectedCategoryChange(category);
      }
    },
    [onSelectedCategoryChange, selectedCategory],
  );
  return (
    <View style={styles.container}>
      {splitCategories.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((category) => (
            <CategoryListItem
              onPress={onItemPress}
              size="slim"
              key={getCategoryId(category)}
              selected={
                getCategoryId(selectedCategory) === getCategoryId(category)
              }
              category={category}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});
