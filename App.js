import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BudgetTabBtn } from './components/TabButtons/Budget';
import { FriendsTabBtn } from './components/TabButtons/Friends';
import { OverviewTabBtn } from './components/TabButtons/Overview';
import { TransactionsTabBtn } from './components/TabButtons/Transactions';
import { CategoriesProvider } from './context/Categories';
import { TransactionsProvider } from './context/Transactions';
import { UserProvider } from './context/User';
import Budget from './screens/Budget';
import Friends from './screens/Friends';
// import Home from './screens/Home';
import Overview from './screens/Overview';
import SignIn from './screens/SignIn';
import Transactions from './screens/Transactions';
import { colors } from './utils/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const defaultOptions = {
  headerStyle: {},
  headerTintColor: colors.lightBlue,
};

const HomeStackTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      options={{
        tabBarButton: TransactionsTabBtn,
      }}
      name="Transactions"
      component={Transactions}
    />
    <Tab.Screen
      options={{
        tabBarButton: OverviewTabBtn,
      }}
      name="Overview"
      component={Overview}
    />
    <Tab.Screen
      options={{
        tabBarButton: BudgetTabBtn,
      }}
      name="Budget"
      component={Budget}
    />
    <Tab.Screen
      options={{
        tabBarButton: FriendsTabBtn,
      }}
      name="Friends"
      component={Friends}
    />
  </Tab.Navigator>
);

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
              <Stack.Screen
                options={{
                  headerBackVisible: false,
                }}
                name="Home"
                component={HomeStackTabs}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </TransactionsProvider>
      </CategoriesProvider>
    </UserProvider>
  );
}
