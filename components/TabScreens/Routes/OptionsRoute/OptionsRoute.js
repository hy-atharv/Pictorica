import { View, Text,  } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import YourProfile from './YourProfile';
import OptionsScreen from '../../OptionsScreen';
const Stack = createNativeStackNavigator();

export default function OptionsRoute() {
  return (
    
    <Stack.Navigator initialRouteName='OptionScreen'
    screenOptions={{headerShown:false}}>
        <Stack.Screen name='OptionScreen' component={OptionsScreen}/>
        <Stack.Screen name='YourProfile' component={YourProfile}/>
        
    </Stack.Navigator>
  )
}