import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';

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
        {category.icon && (
          <Icon color={colors.grey} name={category.icon} size={20} />
        )}
        <Text style={styles.label}>{category.name || category}</Text>
      </ColorButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    marginLeft: 10,
  },
  button: {
    marginVertical: 0,
  },

  contentWrapper: {
    justifyContent: 'flex-start',
  },
});
