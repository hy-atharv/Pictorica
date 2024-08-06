
import {  StyleSheet, Image, Text, View, Platform,Pressable, StatusBar, Dimensions, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingPage from './components/OnboardingPage';
import SignupPage from './components/SignupPage';
import SigninPage from './components/SigninPage';

import BottomTab from './components/BottomTab';

import { useState, useEffect, useRef } from 'react';


import { onAuthStateChanged} from 'firebase/auth';
//SplashScreen.preventAutoHideAsync();
import { auth } from './Firebase/firebaseConfig';

import NetInfo from '@react-native-community/netinfo';


import * as NavigationBar from 'expo-navigation-bar'



NavigationBar.setBackgroundColorAsync('#000320')
StatusBar.setBarStyle('light-content')


const Stack = createNativeStackNavigator();






export default function App() {


  const [isLoaded, fonterror] = useFonts({
    'ArsenicaTrial-Light': require('./assets/fonts/ArsenicaTrial-Light.ttf'),
    'ArsenicaTrial-Regular': require('./assets/fonts/ArsenicaTrial-Regular.ttf'),
    'BetweenDays': require('./assets/fonts/Betweendays.otf'),
    'Contane': require('./assets/fonts/Contane.otf'),
  });

  const [user, setUser] = useState(null);
  const [isConnected, setConnected] = useState(true);
  


  const onhandleLayout = useCallback(async () => {
    if (isLoaded || fonterror) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded, fonterror]);

  useEffect(() => {
    if (isLoaded || fonterror) {
      onhandleLayout();
    }
  }, [isLoaded, fonterror, onhandleLayout]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("USER IS STILL LOGGED IN: " , user);

      if (user && user.emailVerified) {
        setUser(user);
      } 
      else {
        setUser(null)
      }
    });

    

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setConnected(state.isConnected);
    });



    return () => {
      unsubscribe();
      unsubscribeNetInfo();

    };
    
  }, []);

  if (!isLoaded && !fonterror) {
    return null;
  }



  if(user){
    
    return (
    
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'
        screenOptions={{headerShown:false}}>
        <Stack.Screen name='Home' component={BottomTab}/>
        </Stack.Navigator>
        
     {!isConnected &&
      <View
      style={{position:'absolute',
      height:Dimensions.get('window').height + StatusBar.currentHeight, 
      width:Dimensions.get('window').width, 
      alignSelf:'center', 
      justifyContent:'center',
      backgroundColor:'black', 
      opacity:0.9}}>
      
      <View style={{marginTop:-30,backgroundColor:'#000320', borderRadius:20,alignSelf:'center', width:250, height:150}}>
      <Image
      source={require('./assets/offline.png')}
      style={{marginTop:20, width:50, height:50, resizeMode:'cover', alignSelf:'center'}}/>
      <Text style={{fontFamily:'Contane', color:'white', textAlign:'center',fontSize:20, marginTop:20}}>
       You are Offline!
      </Text>
      </View>
      </View>
     }

    </NavigationContainer>
    
    
    
    );
  }

  else {
    return (
    
    <NavigationContainer>
        <Stack.Navigator 
        screenOptions={{headerShown:false}}>
          <Stack.Screen name='OnboardingPage' component={OnboardingPage}/>
          <Stack.Screen name='SignupPage' component={SignupPage}/>
          <Stack.Screen name='SigninPage' component={SigninPage}/>
        </Stack.Navigator>

      {!isConnected &&
        <View
        style={{position:'absolute',
        height:Dimensions.get('window').height + StatusBar.currentHeight, 
        width:Dimensions.get('window').width, 
        alignSelf:'center', 
        justifyContent:'center',
        backgroundColor:'black', 
        opacity:0.9}}>
      
        <View style={{marginTop:-30,backgroundColor:'#000320', borderRadius:20,alignSelf:'center', width:250, height:150}}>
        <Image
        source={require('./assets/offline.png')}
        style={{marginTop:20, width:50, height:50, resizeMode:'cover', alignSelf:'center'}}/>
        <Text style={{fontFamily:'Contane', color:'white', textAlign:'center',fontSize:20, marginTop:20}}>
        You are Offline!
        </Text>
        </View>
        </View>
      }

    </NavigationContainer>
    
    
    );
  }


}


