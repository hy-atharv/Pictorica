import { View, Share,TouchableOpacity,Text, SafeAreaView, Image, StyleSheet, Platform, StatusBar, Alert,  } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase/firebaseConfig';
import * as Linking from 'expo-linking'



export default function OptionsScreen({navigation}) {




const handleProfile = async() => {
  navigation.navigate('YourProfile');
  
}



const handleFeedback = () => {
  try{
 Linking.openURL('mailto:conquerorhyper@gmail.com?subject=Pictorica%20Feedback')
  } catch(error) {
    Alert.alert('Ahh couldnt open Email..\nIts alrr, hit me up on Discord\nID: hyper_conqueror')
  }
}

const handleShare = async() => {
  try{
    await Share.share({
      message:'Download Pictorica\nWhere Every Picture Tells a Story!\n\nhttps://drive.google.com/drive/folders/1rqd9TlPkKXGptSOiWt1CGFisUjdFCSrh?usp=sharing'
    })
  } catch(error) {
    Alert.alert('Couldnt share..')
  }
 
}

const handleDeveloper = () => {
 Linking.openURL('https://www.linkedin.com/in/hy-atharv')
}



const handleLogOut = async ()=> {
   try{
    await signOut(auth)
   } catch(err){
    console.log(err)
    Alert.alert('Error while logging out')
   }
}

  return (
    <LinearGradient colors={['#030717','#6A0DAD']} style={styles.container}
    start={[1,0]} end={[1,4]}>
      <SafeAreaView>
      <View style={{paddingBottom:40}}>
      <Image
        source={require('../../assets/Pictorica_SplashScreen.png')}
        style={styles.headerImage}>
      </Image> 
      </View>

       <View style={{ padding:20}}>
        <TouchableOpacity  onPress={handleProfile}>
          <View style={styles.optionBox}>
          <Image
          source={require('../../assets/profileIcon.png')}
          style={styles.menuIcons}/>
          <Text style={styles.optionText}>
            Profile
          </Text>
          </View>
        </TouchableOpacity>
       </View>

       <View style={{ padding:20}}>
        <TouchableOpacity  onPress={handleShare}>
          <View style={styles.optionBox}>
          <Image
          source={require('../../assets/shareIcon.png')}
          style={styles.menuIcons}/>
          <Text style={styles.optionText}>
            Share this app
          </Text>
          </View>
        </TouchableOpacity>
       </View>

       <View style={{ padding:20}}>
        <TouchableOpacity  onPress={handleFeedback}>
          <View style={styles.optionBox}>
          <Image
          source={require('../../assets/feedbackIcon.png')}
          style={styles.menuIcons}/>
          <Text style={styles.optionText}>
            Send Feedback
          </Text>
          </View>
        </TouchableOpacity>
       </View>

       <View style={{ padding:20}}>
        <TouchableOpacity  onPress={handleDeveloper}>
          <View style={styles.optionBox}>
          <Image
          source={require('../../assets/developerIcon.png')}
          style={styles.menuIcons}/>
          <Text style={styles.optionText}>
            About Developer
          </Text>
          </View>
        </TouchableOpacity>
       </View>
       


        <TouchableOpacity onPress={handleLogOut} style={styles.logoutBut}>
          <Text style={styles.logoutButtonText}>
            Log Out
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  headerImage:{
    marginTop:30,
    width:250,
    height:60,
    resizeMode:'cover',
    alignSelf:'center'
  },

  optionBox:{
    flexDirection:'row', 
    borderColor:'#6A0DAD',
    borderWidth:2, 
    borderRadius:30,
    height:60, 
    alignItems:'center',
  },

  menuIcons:{
    tintColor:'white',
    width:30,
    height:30,
    resizeMode:'contain',
    marginLeft:30
  },
  optionText:{
    fontFamily:'BetweenDays',
    color:'white',
    fontSize:20,
    textAlignVertical:'center',
    marginLeft:20,
  },

  logoutButtonText:{
    fontFamily:'ArsenicaTrial-Regular',
    fontSize:16, 
    color:'white',
  },
  logoutBut:{
  
    padding:10,
    marginHorizontal:130,
    marginTop:30,
    borderRadius:30,
    alignItems:'center',
    backgroundColor:'#8B0000',
  },
})