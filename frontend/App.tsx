import { StatusBar } from 'expo-status-bar';
import MainNav from './MainNav';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Provider } from 'react-redux';
import store from './src/redux/store'

export default function App() {
  return (
    <Provider store={store}>
      <ActionSheetProvider>
        <NavigationContainer>
          <MainNav />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ActionSheetProvider>
    </Provider>

  );
}