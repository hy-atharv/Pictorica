import { View, Text,  } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LibStoryScreen from '../LibraryRoute/LibStoryScreen';
import InsightsScreen from '../../InsightsScreen';

const Stack = createNativeStackNavigator();

export default function InsightsRoute() {
  return (
    
    <Stack.Navigator initialRouteName='InsightsScreen'
    screenOptions={{headerShown:false}}>
        <Stack.Screen name='InsightsScreen' component={InsightsScreen}/>
        <Stack.Screen name='LibStoryScreen' component={LibStoryScreen}/>
    </Stack.Navigator>
  )
}