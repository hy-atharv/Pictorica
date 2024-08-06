import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, FlatList, Dimensions, SafeAreaView,  } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {  FadeInDown,FadeOutDown, FadeInRight } from 'react-native-reanimated'
import { StatusBar,Platform } from 'react-native'

const onBoardPages = [
  {
    image:require('../assets/arts/Onboard1.jpg'),
    text:'Create an Account and Dive into the World of PicStories'
  },
  {
    image:require('../assets/arts/Onboard2.jpg'),
    text:'Pick a Genre, Upload a Picture, and Start Your Story'
  },
  {
    image:require('../assets/arts/Onboard3.jpg'),
    text:'Let AI Craft Your PicStory with Your Suggestions, in seconds'
  },
  {
    image: require('../assets/arts/Onboard4.jpg'),
    text:'Read It, Listen It or Even Share It with the Pictorica Community'
  },
  
]



const { width } = Dimensions.get('window');



const OnboardPage = ({page}) => {

  return(
  <View style={{justifyContent:'flex-end', width:Dimensions.get('window').width}}> 
    <Image source={page.image} style={styles.onBoardImage}>
    </Image>
      <Text style={styles.onBoardText} adjustsFontSizeToFit={true}>
        {page.text}
      </Text>
    
  </View>
  )
}






export default function OnboardingPage({navigation}) {

  const [diveIn, diveClicked] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0);
  const [loginButtons, setLoginButton] = useState(false)



  const handleDiveInto = () =>{
     diveClicked(!diveIn)
  }





  const onScrollHandler = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setActiveIndex(index);
    if(index===3){
        setLoginButton(!loginButtons)
    }
    else{
      setLoginButton()
    }
  };


  const handleSignUp = () => {
     navigation.navigate('SignupPage')
  }
  
  const handleSignIn = () => {
     navigation.navigate('SigninPage')
  }


  

  return (
    <LinearGradient colors={['#030717','#6A0DAD']} style={styles.container}
    start={[1,0]} end={[1,4]}>
      <SafeAreaView>
      <Image 
      source={require('../assets/Pictorica_SplashScreen.png')}
      style={styles.headerImage}>
      </Image>

      {/*WELCOME PAGE*/}
      {diveIn &&
      <Animated.View entering= {FadeInDown.duration(2000)}  exiting={FadeOutDown.duration(200)}>
        
      <Text style={styles.headerText} adjustsFontSizeToFit={true}>
        {'Welcome to Pictorica\nWhere Every Picture Tells a Story'}
      </Text>
      
      <Image source={require('../assets/arts/LoginPageArt.jpg')}
        style={styles.artImage}>
      </Image>
      
      <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={styles.diveButton}>
      <TouchableOpacity onPress={handleDiveInto}>
          
          <Text style={styles.diveButtonText}>
            Dive Into Your PicStory
          </Text>
      </TouchableOpacity>
      </LinearGradient>
      </Animated.View>
      }


      {/* ONBOARDING PAGE */}
      {!diveIn &&
      <Animated.View entering={FadeInRight.duration(3000)}>
      <FlatList
      style={{marginTop:-130}}
      data={onBoardPages}
      renderItem={({item}) => <OnboardPage page={item}/>}
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      onScroll={onScrollHandler}
      />
      {/*Disabling scroll when last page*/}
      {!loginButtons &&
      <View style={styles.pagination}>
        {onBoardPages.map((_, index) => (
          <View
            key={index}
            
            style={[
              styles.paginationDot,
              { backgroundColor: index === activeIndex ? '#0048CD' : '#B3B3B3' }
            ]}
          />
        ))}
      </View>
      }
      </Animated.View>
      }
      {loginButtons &&
      <Animated.View style={{gap:20}} entering={FadeInDown.duration(1000)}>
        <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={styles.signUpBut}>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.diveButtonText}>
            Sign Up
          </Text>
        </TouchableOpacity>
        </LinearGradient>

        <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={styles.signInBut}>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.diveButtonText} adjustsFontSizeToFit={true}>
            Already an Account?  Sign In
          </Text>
        </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
      }

      </SafeAreaView>
    </LinearGradient>
      
    
  )
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
  },

  headerImage:{
  marginTop:-140,
  width:380,
  height:380,
  resizeMode:'contain',
  alignSelf:'center'
},

headerText:{
  marginTop: Platform.OS==='ios'?-100:-120,
  fontFamily:'ArsenicaTrial-Regular',
  color:'white',
  fontSize:27,
  textAlign:'center',
  textShadowColor:'silver',
  textShadowRadius:10
},
artImage:{
   alignSelf:'center',
   resizeMode:'cover',
   width:330,
   height:350,
   marginTop:20,
   borderRadius:50,
   shadowColor:'#6A0DAD',
   elevation:15,
   shadowRadius:50,
   shadowOpacity:0.5,
   shadowOffset:{
   height:0, width:0 }
},

diveButton:{
  marginTop:40,
  padding:10,
  marginHorizontal:50,
  borderRadius:30,
  alignItems:'center',
  shadowColor:'#6A0DAD',
  elevation:5,
},

diveButtonText:{
  fontFamily:'ArsenicaTrial-Light',
  fontSize:20, 
  color:'white',
},
onBoardImage:{
  resizeMode:'cover',
  width:330,
  height:350,
  alignSelf:'center',
  borderRadius:20,
  
},
onBoardText:{
  fontFamily:'ArsenicaTrial-Regular',
  fontSize:27,
  color:'white',
  padding:15,
  textAlign:'center',
  textShadowColor:'silver',
  textShadowRadius:10,

},
pagination: {
  flexDirection: 'row',
  padding:20,
  alignSelf:'center'
},
paginationDot: {
  width: 10,
  height: 10,
  borderRadius: 5,
  marginHorizontal: 5,
},

signUpBut:{
  
  padding:10,
  marginHorizontal:120,
  borderRadius:30,
  alignItems:'center',
  shadowColor:'#6A0DAD',
  elevation:5,
  shadowRadius:10,
  shadowOpacity:1,
  shadowOffset:{
    height:0, width:0
   }
},
signInBut:{
  padding:10,
  marginHorizontal:40,
  borderRadius:30,
  alignItems:'center',
  shadowColor:'#6A0DAD',
  elevation:5,
  shadowRadius:10,
  shadowOpacity:1,
  shadowOffset:{
    height:0, width:0
   }
},
})
