import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LibraryRoute from './TabScreens/Routes/LibraryRoute/LibraryRoute';
import ShelfRoute from './TabScreens/Routes/ShelfRoute/ShelfRoute';
import CreateStoryRoute from './TabScreens/Routes/CreateStoryRoute/CreateStoryRoute';
import OptionsRoute from './TabScreens/Routes/OptionsRoute/OptionsRoute';
import Animated, {BounceIn} from 'react-native-reanimated';
import InsightsRoute from './TabScreens/Routes/InsightsRoute/InsightsRoute';


const Tab = createBottomTabNavigator();


const LibraryIcon = ({focused})=>{
 return(
    
     <View style={{width:60, alignItems:'center',height: 36,borderRadius:30,backgroundColor: focused?'#6A0DAD':'transparent',}}>
        <Image
          source={require("../assets/BottomTabIcons/libraryIcon.png")}
          style={{tintColor:focused?'#FAE6E7': null,marginVertical:3,width:30, height:focused?30:26,  resizeMode:'contain'}}>
        </Image>
     </View>

 )
}

const ShelfIcon = ({focused})=>{
    return(
        <View style={{width:60, alignItems:'center',height: 36,borderRadius:30,backgroundColor: focused?'#6A0DAD':'transparent',}}>
           <Image
             source={require("../assets/BottomTabIcons/shelfIcon.png")}
             style={{tintColor:focused?'#FAE6E7': null,marginVertical:3,width:30, height:focused?30:26,  resizeMode:'contain'}}>
           </Image>
        </View>
    )
}

const CreateIcon = ({focused})=>{
    return(
        <Animated.View entering={BounceIn.duration(500)}>
        <View style={{width:60, alignItems:'center',height: 41,borderRadius:30,}}>
           <Image
             source={require("../assets/BottomTabIcons/createIcon.png")}
             style={{marginVertical:3,width:focused?35:30, height:focused?35:30, tintColor: focused?null:'white', resizeMode:'contain'}}>
           </Image>
        </View>
        </Animated.View>
    )
}

const InsightsIcon = ({focused})=>{
    return(
        <View style={{width:60, alignItems:'center',height: 36,borderRadius:30,backgroundColor: focused?'#6A0DAD':'transparent',}}>
           <Image
             source={require("../assets/BottomTabIcons/insightsIcon.png")}
             style={{tintColor:focused?'#FAE6E7': null,marginVertical:3,width:30, height:focused?30:26,  resizeMode:'contain'}}>
           </Image>
        </View>
    )
}

const OptionsIcon = ({focused})=>{
    return(
        <View style={{width:60, alignItems:'center',height: 34,borderRadius:30,backgroundColor: focused?'#6A0DAD':'transparent',}}>
           <Image
             source={require("../assets/BottomTabIcons/menuIcon.png")}
             style={{tintColor:focused?'#FAE6E7': null,marginVertical:3,width:30, height:focused?26:22,  resizeMode:'contain'}}>
           </Image>
        </View>
    )
}


export default function BottomTab() {
  return (
    <Tab.Navigator initialRouteName='Library'
       
       screenOptions={{
        tabBarShowLabel:false,
        tabBarHideOnKeyboard:true,
        headerShown:false,
        tabBarStyle: styles.tabStyle}}>
        <Tab.Screen name='Library' component={LibraryRoute}
          options={{tabBarIcon:({focused}) => <LibraryIcon focused={focused}/>}}/>
        <Tab.Screen name='Shelf' component={ShelfRoute}
          options={{tabBarIcon:({focused}) => <ShelfIcon focused={focused}/>}}/>
        <Tab.Screen name='Create' component={CreateStoryRoute}
          options={{tabBarIcon:({focused}) => <CreateIcon focused={focused}/>}}/>
        <Tab.Screen name='Insights' component={InsightsRoute}
          options={{tabBarIcon:({focused}) => <InsightsIcon focused={focused}/>}}/>
        <Tab.Screen name='Options' component={OptionsRoute}
          options={{tabBarIcon:({focused}) => <OptionsIcon focused={focused}/>}}/>
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({

    tabStyle:{
        position:'absolute',
        right:0,
        left:0,
        bottom:0,
        backgroundColor:'#000320',
        elevation:0,
        height:60,
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        borderTopWidth:0,
    }
    
  });