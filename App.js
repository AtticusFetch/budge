import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TransactionsProvider } from './context/Transactions';
import { UserProvider } from './context/User';
import Home from './screens/Home';
import ProfileSelect from './screens/ProfileSelect';
import Transactions from './screens/Transactions';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <TransactionsProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="ProfileSelect">
            <Stack.Screen name="Profile Select" component={ProfileSelect} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Transactions" component={Transactions} />
          </Stack.Navigator>
        </NavigationContainer>
      </TransactionsProvider>
    </UserProvider>
  );
}
