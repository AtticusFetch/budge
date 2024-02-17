import numbro from 'numbro';
import { useCallback, useState } from 'react';
import { LayoutAnimation, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';

export const TransactionListItem = (props) => {
  const [expanded, setExpanded] = useState(false);
  const { note, amount, category, date } = props;
  const isPositiveFlow = amount <= 0;
  const formattedAmount = numbro(0 - amount).formatCurrency({ mantissa: 2 });

  const onPress = useCallback(() => {
    LayoutAnimation.configureNext({
      duration: 700,
      update: { type: 'spring', springDamping: 0.4 },
    });
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <ColorButton
      onPress={onPress}
      colorName="blue"
      size={expanded ? 'thick' : ''}
      style={styles.button}
      childrenWrapperStyle={styles.itemContainer}
    >
      <View style={styles.mainContent}>
        {category.icon && (
          <Icon color={colors.grey} name={category.icon} size={30} />
        )}
        <Text style={[styles.text, isPositiveFlow && styles.positiveAmount]}>
          {formattedAmount}
        </Text>
      </View>
      {expanded && (
        <View style={styles.categoryNameContainer}>
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
      )}
      {expanded && (
        <View style={styles.extraContent}>{note && <Text>{note}</Text>}</View>
      )}
    </ColorButton>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'column',
    padding: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 5,
    width: '50%',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 20,
  },
  extraContent: {
    flex: 1,
  },
  categoryNameContainer: {
    opacity: 0.5,
    position: 'absolute',
    top: 2,
    backgroundColor: colors.grey,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxHeight: 18,
  },
  categoryName: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  text: {
    fontSize: 15,
    marginLeft: 10,
    color: colors.red,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: colors.green,
  },
});
