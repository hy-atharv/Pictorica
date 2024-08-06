import { View, Text,  } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateStoryScreenScreen from '../../CreateStoryScreen';
import StoryScreen from './StoryScreen';
import LibraryRoute from '../LibraryRoute/LibraryRoute';

const Stack = createNativeStackNavigator();

export default function CreateStoryRoute() {
  return (
    
    <Stack.Navigator initialRouteName='CreateStory'
    screenOptions={{headerShown:false}}>
        <Stack.Screen name='CreateStory' component={CreateStoryScreenScreen}/>
        <Stack.Screen name='StoryScreen' component={StoryScreen}/>
        <Stack.Screen name='Library' component={LibraryRoute}/>
    </Stack.Navigator>
  )
}