import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';
import { Icon } from '../Icon';

export const CategoryListItem = (props) => {
  const {
    category,
    selected,
    onPress,
    btnStyle,
    btnContainerStyle,
    btnContentStyle,
  } = props;

  const [categoryColor, setCategoryColor] = useState('blue');
  const [categoryName, setCategoryName] = useState('');

  const onItemPress = useCallback(() => {
    props.onPress(category);
  }, [category, onPress]);

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
        {!!categoryName && <Text style={styles.label}>{categoryName}</Text>}
      </ColorButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
