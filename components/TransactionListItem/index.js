import moment from 'moment';
import numbro from 'numbro';
import { useCallback } from 'react';
import { ActionSheetIOS, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { ExpandableButton } from '../ExpandableButton';
import { Icon } from '../Icon';

const TRANSACTION_ACTIONS = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  EDIT: 'Edit',
};

const actionSheetOptions = Object.values(TRANSACTION_ACTIONS);

export const TransactionListItem = (props) => {
  const { note, amount, category, date, splitWith, tips, onDelete, id } = props;
  const isPositiveFlow = amount <= 0;
  const isUpcoming = moment(date).isAfter(moment());
  const formattedAmount = numbro(0 - amount).formatCurrency({ mantissa: 2 });
  const onActionSelected = useCallback(async (actionIndex) => {
    switch (actionSheetOptions[actionIndex]) {
      case TRANSACTION_ACTIONS.CANCEL:
        break;
      case TRANSACTION_ACTIONS.DELETE:
        await onDelete(id);
        break;
      case TRANSACTION_ACTIONS.EDIT:
        console.log(actionSheetOptions[actionIndex]);
        break;
    }
  }, []);
  const onTransactionLongPress = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: actionSheetOptions,
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      onActionSelected,
    );
  }, []);

  return (
    <ExpandableButton
      onLongPress={onTransactionLongPress}
      colorName={isUpcoming ? 'grey' : 'blue'}
      style={isUpcoming && { opacity: 0.5 }}
      mainContent={
        <>
          <Icon color={colors.grey} name={category?.icon} size={30} />
          <Text style={[styles.text, isPositiveFlow && styles.positiveAmount]}>
            {formattedAmount}
          </Text>
        </>
      }
      extraContent={
        <>
          {note && (
            <View style={[styles.labelContainer, styles.noteContainer]}>
              <Text style={[styles.labelText, styles.noteText]}>{note}</Text>
            </View>
          )}
          {date && (
            <View style={[styles.labelContainer, styles.dateContainer]}>
              <Text style={[styles.labelText, styles.dateText]}>
                {moment(date).format('MMM D, YYYY')}
              </Text>
            </View>
          )}
          <View style={styles.labelsContainer}>
            {!!splitWith?.length && (
              <View style={[styles.subLabel, styles.splitLabelContainer]}>
                <Text style={styles.subLabelText}>Split</Text>
              </View>
            )}
            {!!tips && (
              <View style={[styles.subLabel, styles.tipsLabelContainer]}>
                <Text style={[styles.subLabelText, styles.tipsLabelText]}>
                  Tip: {tips}
                </Text>
              </View>
            )}
            <View style={[styles.subLabel, styles.categoryNameContainer]}>
              <Text style={styles.categoryName}>{category?.name}</Text>
            </View>
          </View>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  subLabel: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxHeight: 18,
    marginTop: 8,
  },
  categoryNameContainer: {
    opacity: 0.5,
    backgroundColor: colors.grey,
  },
  labelsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitLabelContainer: {
    backgroundColor: colors.yellow,
  },
  tipsLabelContainer: {
    backgroundColor: colors.lightBlue,
  },
  tipsLabelText: {
    color: 'white',
  },
  subLabelText: {
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
  labelContainer: {
    borderColor: colors.blue,
    borderWidth: 1.5,
    padding: 5,
    borderRadius: 100,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginVertical: 1,
  },
  labelText: {
    color: colors.grey,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dateContainer: {},
  dateText: {},
  noteContainer: {},
  noteText: {},
});
