import moment from 'moment';
import numbro from 'numbro';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { colors } from '../../utils/colors';
import { ExpandableButton } from '../ExpandableButton';

export const TransactionListItem = (props) => {
  const { note, amount, category, date, splitWith } = props;
  const isPositiveFlow = amount <= 0;
  const formattedAmount = numbro(0 - amount).formatCurrency({ mantissa: 2 });

  return (
    <ExpandableButton
      mainContent={
        <>
          {category.icon && (
            <Icon color={colors.grey} name={category.icon} size={30} />
          )}
          <Text style={[styles.text, isPositiveFlow && styles.positiveAmount]}>
            {formattedAmount}
          </Text>
        </>
      }
      extraContent={
        <>
          {note && <Text>{note}</Text>}
          {date && <Text>{moment(date).format('MMM D, YYYY')}</Text>}
          <View style={styles.labelsContainer}>
            {!!splitWith?.length && (
              <View style={styles.splitLabelContainer}>
                <Text style={styles.labelText}>Split</Text>
              </View>
            )}
            <View style={styles.categoryNameContainer}>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          </View>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  categoryNameContainer: {
    opacity: 0.5,
    backgroundColor: colors.grey,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxHeight: 18,
    marginTop: 8,
  },
  labelsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitLabelContainer: {
    backgroundColor: colors.yellow,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxHeight: 18,
    marginTop: 8,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.grey,
  },
  categoryName: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
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
