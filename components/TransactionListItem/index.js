import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { ActionSheetIOS, StyleSheet, Text, View } from 'react-native';

import { useCategoriesContext } from '../../context/Categories';
import { colors } from '../../utils/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import { mapPlaidCategory } from '../../utils/plaidCategoryMapper';
import { ExpandableButton } from '../ExpandableButton';
import { Icon } from '../Icon';
import { LabeledCheckbox } from '../LabeledCheckbox';

const TRANSACTION_ACTIONS = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  EDIT: 'Edit',
};

const PLAID_TRANSACTION_ACTIONS = {
  CANCEL: 'Cancel',
  IGNORE: 'Ignore',
  TRANSFER: 'Transfer',
};

const actionSheetOptions = Object.values(TRANSACTION_ACTIONS);
const plaidActionSheetOptions = Object.values(PLAID_TRANSACTION_ACTIONS);

export const TransactionListItem = (props) => {
  const {
    state: { categories },
  } = useCategoriesContext();
  const [mappedCategory, setMappedCategory] = useState(props.category);
  const {
    onDelete,
    onEdit,
    roundDirection,
    style,
    onIgnore,
    onTransfer,
    showCheckbox,
    selected,
    onSelect,
    ...transactionData
  } = props;
  const {
    note,
    amount,
    date,
    merchant_name,
    splitWith,
    tips,
    id,
    personal_finance_category,
  } = transactionData;

  useEffect(() => {
    if (personal_finance_category) {
      setMappedCategory(
        mapPlaidCategory(personal_finance_category, categories),
      );
    }
  }, [personal_finance_category, categories]);

  const onTransactionSelect = useCallback(() => {
    onSelect(transactionData);
  }, [onSelect, transactionData]);

  const isPositiveFlow = amount <= 0;
  const isUpcoming = moment(date).isAfter(moment());
  const formattedAmount = formatCurrency(0 - amount);
  const onActionSelected = useCallback(async (actionIndex) => {
    switch (actionSheetOptions[actionIndex]) {
      case TRANSACTION_ACTIONS.CANCEL:
        break;
      case TRANSACTION_ACTIONS.DELETE:
        await onDelete(id);
        break;
      case TRANSACTION_ACTIONS.EDIT:
        await onEdit(transactionData);
        break;
    }
  }, []);
  const onPlaidActionSelected = useCallback(async (actionIndex) => {
    switch (plaidActionSheetOptions[actionIndex]) {
      case PLAID_TRANSACTION_ACTIONS.CANCEL:
        break;
      case PLAID_TRANSACTION_ACTIONS.IGNORE:
        await onIgnore(transactionData);
        break;
      case PLAID_TRANSACTION_ACTIONS.TRANSFER:
        await onTransfer(transactionData);
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
  const onPlaidTransactionLongPress = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: plaidActionSheetOptions,
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      onPlaidActionSelected,
    );
  }, []);

  const hasSplit = !!splitWith?.length;
  const isPlaidTransaction =
    !transactionData.transformedPlaid && !!transactionData.transaction_id;

  const checkBoxVisible = showCheckbox && isPlaidTransaction;
  return (
    <ExpandableButton
      onLongPress={
        isPlaidTransaction
          ? onPlaidTransactionLongPress
          : onTransactionLongPress
      }
      colorName={isUpcoming || isPlaidTransaction ? 'grey' : 'blue'}
      style={[
        styles.btnContainer,
        isPlaidTransaction && styles.plaidItem,
        isUpcoming && { opacity: 0.5 },
        style,
      ]}
      childrenWrapperStyle={styles.btnStyle}
      mainContentStyle={styles.mainContentStyle}
      roundDirection={roundDirection || (isPlaidTransaction ? 'left' : 'right')}
      mainContent={
        <View
          style={[
            styles.transactionWrapper,
            hasSplit && styles.splitBorder,
            checkBoxVisible && styles.wrapperWithCheckbox,
          ]}
        >
          {checkBoxVisible && (
            <LabeledCheckbox
              isChecked={selected}
              onPress={onTransactionSelect}
              style={styles.checkbox}
              labelStyle={styles.checkboxLabel}
            />
          )}
          <Icon color={colors.grey} name={mappedCategory?.icon} size={30} />
          {(note || mappedCategory) && (
            <View style={[styles.noteContainer]}>
              {note && (
                <Text style={[styles.labelText, styles.noteText]}>{note}</Text>
              )}
              {!!mappedCategory && (
                <Text style={[styles.labelText, styles.noteText]}>
                  {mappedCategory?.name}
                </Text>
              )}
            </View>
          )}
          <View style={styles.transactionContainer}>
            <Text
              style={[styles.text, isPositiveFlow && styles.positiveAmount]}
            >
              {formattedAmount}
            </Text>
          </View>
        </View>
      }
      extraContent={
        <View style={styles.extraContainer}>
          {merchant_name && (
            <View style={[styles.labelContainer, styles.noteContainer]}>
              <Text style={[styles.labelText, styles.noteText]}>
                {merchant_name}
              </Text>
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
            {hasSplit && (
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
              <Text style={styles.categoryName}>{mappedCategory?.name}</Text>
            </View>
          </View>
        </View>
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
  mainContentStyle: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  btnStyle: {
    paddingBottom: 0,
  },
  wrapperWithCheckbox: {
    paddingLeft: 40,
  },
  checkbox: {
    padding: 0,
    flex: 0,
    position: 'absolute',
    left: 0,
    height: '100%',
    borderWidth: 0,
  },
  checkboxLabel: {},
  extraContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  btnContainer: {
    maxWidth: '80%',
  },
  plaidItem: {
    alignSelf: 'flex-end',
  },
  splitBorder: {
    borderStartColor: colors.yellow,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderEndColor: 'transparent',
    borderWidth: 6,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  transactionWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
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
  noteContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteText: {},
});
