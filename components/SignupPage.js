import { SafeAreaView, View, Text, TextInput, Image, StyleSheet,Platform,StatusBar, ImageBackground, KeyboardAvoidingView, Dimensions, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { createUser } from '../Firebase/firebaseRegister'
import { ActivityIndicator } from 'react-native'
import { getFirestore, collection,query,where, getDocs} from 'firebase/firestore'
import { app } from '../Firebase/firebaseConfig'


const db = getFirestore(app);

export default function SignupPage({navigation}) {

const [usernameEntered, onUsernameTyped] = useState('')
const [emailEntered, onEmailTyped] = useState('')
const [passEntered, onPassTyped] = useState('')
const [loading, setLoading] = useState(false)

const handleReg = async () => {
  
  if (emailEntered && passEntered && usernameEntered) {
    setLoading(true);
    try {
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('username', '==', usernameEntered));
      const querySnapshot = await getDocs(q);

      if (!(querySnapshot.empty)) {
        Alert.alert('Username already exists\nChoose a Unique One');
        setLoading(false);
      } else {
        console.log("Username allowed");
        await createAccount();
      }
    } catch (error) {
      console.error("Error getting document:", error);
      setLoading(false);
    }
  }
};

const createAccount = async () => {
  try {
    await createUser(emailEntered, passEntered, usernameEntered);
    setLoading(false);
  } catch (err) {
    console.log(err);
    setLoading(false);
  }
};
 



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
             Sign Up
          </Text>

          <Text style={styles.placeholderText}>
             Username
          </Text>
          <TextInput style={styles.emailBox}
          maxLength={20}
           value={usernameEntered}
           onChangeText={onUsernameTyped}/>


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
        style={styles.regBut}>
        <TouchableOpacity onPress={handleReg}>
          <Text style={styles.regButtonText}>
            Register
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
        resizeMode:'cover',
        alignSelf:'center'
    },
    signupText:{
        marginTop:20,
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
    regBut:{
        marginTop:80,
        padding:10,
        marginHorizontal:120,
        borderRadius:30,
        alignItems:'center',
        shadowColor:'#6A0DAD',
        elevation:5,
    },
    regButtonText:{
        fontFamily:'ArsenicaTrial-Light',
        fontSize:20, 
        color:'white',
    },
    
})