import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { CategoryListItem } from '../CategoryListItem';
import { ColorButton } from '../ColorButton';

const splitIntoRows = (countPerRow, arr = []) => {
  const rows = [];
  for (let i = 0; i < arr.length; i += countPerRow) {
    const chunk = arr.slice(i, i + countPerRow);
    rows.push(chunk);
  }

  return rows;
};

export const CategoriesList = (props) => {
  const { categories, onSelectedCategoryChange } = props;
  const [selectedCategory, setselectedCategory] = useState(null);
  const splitCategories = splitIntoRows(2, categories);
  const onItemPress = useCallback(
    (category) => {
      setselectedCategory(category);
      onSelectedCategoryChange(category);
    },
    [onSelectedCategoryChange, selectedCategory],
  );
  return (
    <View style={styles.container}>
      {splitCategories.map((row) => (
        <View style={styles.row}>
          {row.map((category) => (
            <CategoryListItem
              onPress={onItemPress}
              size="slim"
              key={category.id}
              selected={selectedCategory?.id === category.id}
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
