import { StyleSheet, View } from 'react-native';

import { CategorySpending } from '../components/Charts/CategorySpending';
import { ProgressSpending } from '../components/Charts/ProgressSpending';
import { useUserContext } from '../context/User';
import { colors } from '../utils/colors';

export default function Overview({ navigation }) {
  const {
    state: { user },
  } = useUserContext();
  const { budget, transactions } = user;

  const chartConfig = {
    backgroundColor: colors.yellow,
    backgroundGradientFrom: colors.grey,
    backgroundGradientTo: colors.seeThrough.grey,
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => 'white',
  };

  return (
    <View style={styles.container}>
      <CategorySpending transactions={transactions} chartConfig={chartConfig} />
      <ProgressSpending
        budget={budget}
        transactions={transactions}
        chartConfig={chartConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
});
