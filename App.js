import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CategoriesProvider } from './context/Categories';
import { TransactionsProvider } from './context/Transactions';
import { UserProvider } from './context/User';
import Budget from './screens/Budget';
import Home from './screens/Home';
import Overview from './screens/Overview';
import SignIn from './screens/SignIn';
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
      <CategoriesProvider>
        <TransactionsProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={defaultOptions}
              initialRouteName="SignIn"
            >
              <Stack.Screen name="Sign In" component={SignIn} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Overview" component={Overview} />
              <Stack.Screen name="Transactions" component={Transactions} />
              <Stack.Screen name="Budget" component={Budget} />
            </Stack.Navigator>
          </NavigationContainer>
        </TransactionsProvider>
      </CategoriesProvider>
    </UserProvider>
  );
}
