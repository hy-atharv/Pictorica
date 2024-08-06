import { SafeAreaView, TouchableOpacity, View, Text, TextInput, Image, StyleSheet,Platform,StatusBar, ImageBackground, KeyboardAvoidingView, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { signIn } from '../Firebase/firebaseLogin'

export default function SigninPage() {

const [emailEntered, onEmailTyped] = useState('')
const [passEntered, onPassTyped] = useState('')
const [loading, setLoading] = useState(false)


const handleLog = async () => {

  setLoading(true)
  if(emailEntered && passEntered){
    try{
      await signIn(emailEntered, passEntered)
      setLoading(false)
    } catch(err){
      console.log(err)
      setLoading(false)
    }
  }
}



  return (

    <LinearGradient colors={['#030717','#6A0DAD']} style={styles.container}
    start={[1,0]} end={[1,4]}>
        
    <SafeAreaView>
    <KeyboardAvoidingView style={{flex:1}}  behavior={Platform.OS ==='ios'? 'padding': 'height'} > 
    <View style={{justifyContent:'flex-end'}}>
    
      <View>
       <Image 
      source={require('../assets/Pictorica_SplashScreen.png')}
      style={styles.headerImage}>
       </Image>
       </View>

       
        
       
       <Animated.View  entering={FadeInDown.duration(1000)}>
          
       
          <ImageBackground 
          source={require('../assets/arts/SignupArt.jpg')}
          style={{marginBottom:130,height:Dimensions.get('window').height, width:Dimensions.get('window').width}}
          imageStyle={{borderRadius:10,resizeMode:'cover'}}>
            

             
          
          
          <Text style={styles.signupText}>
             Sign In
          </Text>

          
          <Text style={styles.placeholderText}>
             Email
          </Text>
          <TextInput style={styles.emailBox}
           keyboardType='email-address'
           value={emailEntered}
           onChangeText={onEmailTyped}/>

          <Text style={styles.placeholderText}>
             Password
          </Text>
          <TextInput style={styles.emailBox}
           secureTextEntry={true}
           value={passEntered}
           onChangeText={onPassTyped}/>
           
        <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={styles.loginBut}>
        <TouchableOpacity onPress={handleLog}>
          <Text style={styles.loginButtonText}>
            Login
          </Text>
        </TouchableOpacity>
        </LinearGradient>
          
           

        </ImageBackground>

          

       </Animated.View>
        
        
       
      </View>
      </KeyboardAvoidingView>  

      {loading &&
         <ActivityIndicator
         style={{position:'absolute', 
         height:Dimensions.get('window').height, 
         width:Dimensions.get('window').width, 
         alignSelf:'center', 
         backgroundColor:'black', 
         opacity:0.5}}
         size='large'
         color='#6A0DAD'/>
        }     
       
      </SafeAreaView>
      
    </LinearGradient>
    
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    headerImage:{
        marginTop:-140,
        width:380,
        height:380,
        resizeMode:'contain',
        alignSelf:'center'
    },
    signupText:{
        marginTop:40,
        fontFamily:'ArsenicaTrial-Regular',
        color:'white',
        fontSize:34,
        textAlign:'center',
        textShadowColor:'silver',
        textShadowRadius:10
    },

    placeholderText:{
    
        fontFamily:'ArsenicaTrial-Light',
        marginTop:40,
        color:'white',
        fontSize:20,
        paddingHorizontal:50,
        textAlign:'left',
        textShadowColor:'silver',
        textShadowRadius:10
    },

    emailBox:{
        alignSelf:'center',
        marginTop:5,
        padding:15,
        paddingBottom:10,
        width:300,
        height:45,
        borderRadius:30,
        backgroundColor:'#6A0DAD',
        color:'white',
        fontSize:18,
    },
    loginBut:{
        marginTop:80,
        padding:10,
        marginHorizontal:120,
        borderRadius:30,
        alignItems:'center',
        shadowColor:'#6A0DAD',
        elevation:5,
    },
    loginButtonText:{
        fontFamily:'ArsenicaTrial-Light',
        fontSize:20, 
        color:'white',
    },
    
})