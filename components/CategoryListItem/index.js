import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';
import { Icon } from '../Icon';

export const CategoryListItem = (props) => {
  const {
    category: maybeCategory,
    selected,
    onPress,
    btnStyle,
    btnContainerStyle,
    btnContentStyle,
  } = props;
  const category = maybeCategory.category || maybeCategory;

  const [categoryColor, setCategoryColor] = useState('blue');
  const [categoryName, setCategoryName] = useState('');

  const onItemPress = useCallback(() => {
    props.onPress(maybeCategory);
  }, [maybeCategory, onPress]);

  useEffect(() => {
    if (category.color) {
      setCategoryColor(category.color);
    } else if (selected) {
      setCategoryColor('yellow');
    } else {
      setCategoryColor('blue');
    }
  }, [selected, category.color]);
  useEffect(() => {
    if (typeof category === 'string') {
      setCategoryName(category);
    } else if (category.name) {
      setCategoryName(category.name);
    }
  }, [category]);

  return (
    <View style={[styles.container, btnContainerStyle]}>
      <ColorButton
        colorName={categoryColor}
        size="slim"
        style={[styles.button, btnStyle]}
        onPress={onItemPress}
        childrenWrapperStyle={[styles.contentWrapper, btnContentStyle]}
      >
        {!!category?.icon && (
          <Icon color={colors.grey} name={category?.icon} size={25} />
        )}
        <View style={styles.labelsContainer}>
          {!!maybeCategory.note && (
            <Text style={styles.label}>{maybeCategory.note}</Text>
          )}
          {!!categoryName && <Text style={styles.label}>{categoryName}</Text>}
        </View>
      </ColorButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginLeft: 5,
    maxWidth: '80%',
  },
  button: {
    marginVertical: 0,
  },

  contentWrapper: {
    justifyContent: 'flex-start',
    padding: 5,
    paddingLeft: 5,
  },
});
