import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  session: '@budgeStore:session',
};

export const getUserSession = async () => {
  const session = await AsyncStorage.getItem(KEYS.session);
  let userInfo;

  try {
    userInfo = JSON.parse(session);
  } catch {
    await AsyncStorage.clear();
    console.error('Parse session error');
  }

  return userInfo;
};

export const saveUserSession = async (payload) => {
  await AsyncStorage.setItem(KEYS.session, JSON.stringify(payload));
};
