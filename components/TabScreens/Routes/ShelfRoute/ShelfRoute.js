import { View, Text,  } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ShelfScreen from '../../ShelfScreen';
import LibStoryScreen from '../LibraryRoute/LibStoryScreen';
import StoryMainChar from '../LibraryRoute/StoryMainChar';
const Stack = createNativeStackNavigator();

export default function ShelfRoute() {
  return (
    
    <Stack.Navigator initialRouteName='ShelfScreen'
    screenOptions={{headerShown:false}}>
        <Stack.Screen name='ShelfScreen' component={ShelfScreen}/>
        <Stack.Screen name='LibStoryScreen' component={LibStoryScreen}/>
        <Stack.Screen name='MainCharacter' component={StoryMainChar}/>
    </Stack.Navigator>
  )
}