import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransactionsProvider } from './context/Transactions';
import { UserProvider } from './context/User';
import Budget from './screens/Budget';
import Home from './screens/Home';
import ProfileSelect from './screens/ProfileSelect';
import Transactions from './screens/Transactions';
import { colors } from './utils/colors';

const Stack = createNativeStackNavigator();

const defaultOptions = {
  headerStyle: {},
  headerTintColor: colors.lightBlue,
};

export default function App() {
  return (
    <UserProvider>
      <TransactionsProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={defaultOptions}
            initialRouteName="ProfileSelect"
          >
            <Stack.Screen name="Profile Select" component={ProfileSelect} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Transactions" component={Transactions} />
            <Stack.Screen name="Budget" component={Budget} />
          </Stack.Navigator>
        </NavigationContainer>
      </TransactionsProvider>
    </UserProvider>
  );
}
