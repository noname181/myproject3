import React, { useState, useEffect } from 'react';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './src/navigation/HomeStack';
import TabNavigation from './src/navigation/TabNavigation';
import { Provider } from 'react-redux';
// Imports: Redux Store
import { store } from './src/redux-saga/store';
import AuthContext from './src/hooks/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import { I18nManager } from "react-native";
import jwtDecode from 'jwt-decode';
import SplashScreen from 'react-native-splash-screen';

// import firebase from '@react-native-firebase/app';

// I18nManager.forceRTL(false);
// I18nManager.allowRTL(false);

// const firebaseConfig = {
//   apiKey: "AIzaSyBmVTINmEXBgSXeCPZ_8YGFoPdWtAazwuA",
//   authDomain: "myproject-7549f.firebaseapp.com",
//   databaseURL: "https://myproject-7549f.firebaseio.com",
//   projectId: "myproject-7549f",
//   storageBucket: "myproject-7549f.appspot.com",
//   messagingSenderId: "776403509046",
//   appId: "1:776403509046:web:c20fadb0e0c0eb050c9d97",
//   measurementId: "G-EJ9JWSFWRK"
// };
// // Initialize Firebase
// if (!firebase.apps.length)
//   firebase.initializeApp(firebaseConfig);

// export { firebase };

export default function App() {
  const [user, setUser] = useState();
  // // To see all the requests in the chrome Dev tools in the network tab.
  // XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
  //   GLOBAL.originalXMLHttpRequest :
  //   GLOBAL.XMLHttpRequest;

  // // fetch logger
  // global._fetch = fetch;
  // global.fetch = function (uri, options, ...args) {
  //   return global._fetch(uri, options, ...args).then((response) => {
  //     console.log('Fetch', { request: { uri, options, ...args }, response });
  //     return response;
  //   });
  // };

  async function checkUserSignedIn() {
    try {
      let token = await AsyncStorage.getItem('token');

      if (token != null) {

        const user = jwtDecode(token);

        setUser(user);
      }
    } catch (error) {
      return null;
    }
  }

  useEffect(() => {
    SplashScreen.hide();
    checkUserSignedIn();
    return () => {
    };
  }, []);

  return (

    <AuthContext.Provider value={{ user, setUser }}>
      <Provider store={store}>
        <NavigationContainer>
          <DrawerNavigation />
        </NavigationContainer>
      </Provider>
    </AuthContext.Provider>
  );


}

