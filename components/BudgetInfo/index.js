import _ from 'lodash';
import { Text, View } from 'react-native';

export const BudgetInfo = (props) => {
  const { budget } = props;

  return (
    <View>
      <Text>Income: {budget.income}</Text>
      <Text>
        Outcome: {JSON.stringify(Object.values(_.omit(budget, 'income')))}
      </Text>
    </View>
  );
};
