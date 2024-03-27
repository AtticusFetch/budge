import { omit } from 'lodash';
import { useCallback } from 'react';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { LINK_MODES } from '../../server/constants';
import { colors } from '../../utils/colors';
import { Icon } from '../Icon';

const ACTIONS = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
};

const actionSheetOptions = Object.values(ACTIONS);

const FIELDS_MAP = {
  'categoryId/merchantName': LINK_MODES.CATEGORY_MERCHANT,
  categoryId: LINK_MODES.CATEGORY,
  merchantName: LINK_MODES.MERCHANT,
  transactionId: LINK_MODES.TRANSACTION,
};

export const LinkItem = (props) => {
  const { item, budget, categories, onDelete } = props;
  const fields = Object.keys(
    omit(item, 'id', 'budgetId', 'newCategoryId'),
  ).join('/');
  let target;
  let targetLabel;
  const isBudgetMap = !!item.budgetId;
  const isCategoryMap = !!item.newCategoryId;
  const linkMode = FIELDS_MAP[fields];
  if (isBudgetMap) {
    target = budget.find((b) => b.id === item.budgetId);
    targetLabel = 'budget';
  } else if (isCategoryMap) {
    target = categories.find((c) => c.id === item.newCategoryId);
    targetLabel = 'categoty';
  }
  let parts;
  switch (linkMode) {
    case LINK_MODES.CATEGORY_MERCHANT: {
      const category = categories.find((c) => c.id === item.categoryId);
      parts = [item.merchantName, category?.name];
      break;
    }
    case LINK_MODES.CATEGORY: {
      const category = categories.find((c) => c.id === item.categoryId);
      parts = [category?.name];
      break;
    }
    case LINK_MODES.MERCHANT: {
      parts = [item.merchantName];
      break;
    }
    case LINK_MODES.TRANSACTION: {
      parts = ['1 transaction'];
      break;
    }
  }
  const onActionSelected = useCallback(async (actionIndex) => {
    switch (actionSheetOptions[actionIndex]) {
      case ACTIONS.CANCEL:
        break;
      case ACTIONS.DELETE:
        await onDelete(item.id);
        break;
    }
  }, []);
  const onPress = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: actionSheetOptions,
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      onActionSelected,
    );
  }, []);

  const [part1, part2] = parts;
  return (
    <TouchableOpacity onPress={onPress} key={item.id} style={styles.linkItem}>
      <View style={styles.partsWrapper}>
        <Text style={[styles.label, styles.accentLabel]}>{part1}</Text>
        {!!part2 && (
          <>
            <Icon name="plus" size={30} />
            <Text style={[styles.label, styles.accentLabel]}>{part2}</Text>
          </>
        )}
      </View>
      <Icon name="arrow-right" size={30} />
      <Text style={[styles.label, styles.accentLabel, styles.accentFinal]}>
        {target?.name || target?.note || target?.category?.name}
      </Text>
      <Text style={[styles.label, styles.accentLabel, styles.subLabel]}>
        {targetLabel}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.grey,
  },
  accentLabel: {
    fontWeight: 'bold',
    backgroundColor: colors.seeThrough.blue,
    borderRadius: 5,
    padding: 5,
    marginLeft: 2,
    borderWidth: 1,
  },
  subLabel: {
    backgroundColor: colors.seeThrough.yellow,
    padding: 2,
    fontSize: 10,
  },
  partsWrapper: {
    alignItems: 'center',
  },
  accentFinal: {
    backgroundColor: colors.dimmed.green,
  },
  linkItem: {
    flex: 1,
    maxWidth: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.dimmed.grey,
    padding: 10,
    marginVertical: 10,
  },
});
