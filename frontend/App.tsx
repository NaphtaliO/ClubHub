import { StatusBar } from 'expo-status-bar';
import MainNav from './MainNav';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  APIKEY,
  AUTHDOMAIN,
  PROJECTID,
  STORAGEBUCKET,
  MESSAGINGSENDERID,
  APPID,
  MEASUREMENTID,
  URL,
} from "@env";
import { ToastContextProvider } from './src/components/CustomToast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AppProvider } from './src/context/AppContext';
import { SearchContextProvider } from './src/context/SearchContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID,
};

let app;
// Initialize Firebase
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const storage = getStorage(app);



const queryClient = new QueryClient()

export default function App() {

  return (
    <SafeAreaProvider>
      <AppProvider>
        <SearchContextProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
              <ActionSheetProvider>
                <ToastContextProvider>
                  <IconRegistry icons={EvaIconsPack} />
                  <ApplicationProvider {...eva} theme={eva.light}>
                    <QueryClientProvider client={queryClient}>
                      <NavigationContainer>
                        <MainNav />
                        <StatusBar style="auto" />
                      </NavigationContainer>
                    </QueryClientProvider>
                  </ApplicationProvider>
                </ToastContextProvider>
              </ActionSheetProvider>
            </Provider>
          </GestureHandlerRootView>
        </SearchContextProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}