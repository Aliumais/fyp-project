import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  REMEMBER_ME: 'remember_me',
  USER_CREDENTIALS: 'user_credentials',
};

export const saveUserCredentials = async (email, password) => {
  try {
    const credentials = JSON.stringify({ email, password });
    await AsyncStorage.setItem(STORAGE_KEYS.USER_CREDENTIALS, credentials);
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
};

export const getUserCredentials = async () => {
  try {
    const credentials = await AsyncStorage.getItem(STORAGE_KEYS.USER_CREDENTIALS);
    return credentials ? JSON.parse(credentials) : null;
  } catch (error) {
    console.error('Error getting credentials:', error);
    return null;
  }
};

export const clearUserCredentials = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_CREDENTIALS);
  } catch (error) {
    console.error('Error clearing credentials:', error);
  }
};

export const setRememberMe = async (value) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting remember me:', error);
  }
};

export const getRememberMe = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    return value ? JSON.parse(value) : false;
  } catch (error) {
    console.error('Error getting remember me status:', error);
    return false;
  }
};
