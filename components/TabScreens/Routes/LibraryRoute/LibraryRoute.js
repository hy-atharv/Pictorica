import { View, Text,  } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LibraryScreen from '../../LibraryScreen';
import LibStoryScreen from './LibStoryScreen';
import StoryMainChar from './StoryMainChar';
import AuthorProfile from './AuthorProfile';
import YourProfile from '../OptionsRoute/YourProfile';

const Stack = createNativeStackNavigator();

export default function LibraryRoute() {
  return (
    
    <Stack.Navigator initialRouteName='LibraryScreen'
    screenOptions={{headerShown:false}}>
        <Stack.Screen name='LibraryScreen' component={LibraryScreen}/>
        <Stack.Screen name='LibStoryScreen' component={LibStoryScreen}/>
        <Stack.Screen name='AuthorProfile' component={AuthorProfile}/>
        <Stack.Screen name='YourProfile' component={YourProfile}/>
        <Stack.Screen name='MainCharacter' component={StoryMainChar}/>
    </Stack.Navigator>
  )
}