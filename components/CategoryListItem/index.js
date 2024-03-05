import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';
import { Icon } from '../Icon';

export const CategoryListItem = (props) => {
  const { category, selected, onPress } = props;
  const onItemPress = useCallback(() => {
    props.onPress(category);
  }, [category, onPress]);

  return (
    <View style={styles.container}>
      <ColorButton
        colorName={selected ? 'yellow' : 'blue'}
        size="slim"
        style={styles.button}
        onPress={onItemPress}
        childrenWrapperStyle={styles.contentWrapper}
      >
        <Icon color={colors.grey} name={category?.icon} size={20} />
        <Text style={styles.label}>{category.name || category}</Text>
      </ColorButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 110,
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    marginLeft: 5,
  },
  button: {
    marginVertical: 0,
  },

  contentWrapper: {
    justifyContent: 'flex-start',
    padding: 0,
    paddingLeft: 5,
  },
});
