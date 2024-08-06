import { View,TextInput, ActivityIndicator,SafeAreaView, TouchableOpacity, Image,StyleSheet, Platform, Dimensions, StatusBar,ScrollView, Text, ImageBackground, KeyboardAvoidingView, Keyboard, Alert, FlatList } from 'react-native'
import React, { useState, useEffect,useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { ZoomInUp } from 'react-native-reanimated';
import { charChat } from '../../../../GeminiAI/GemCharChat';
import { auth, app } from '../../../../Firebase/firebaseConfig';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var date = new Date().getDate()
var month = monthNames[new Date().getMonth()]
var year = new Date().getFullYear()


const db = getFirestore(app)

export default function StoryMainChar({route}) {
  
  const userID = auth.currentUser.uid


  const {ImageUri, story} = route.params

  const [userInput, onMesgTyped] = useState('')
  const [userMsg, setUserMsg] = useState('')
  const [loading, setLoading] = useState('')
  const [chat, setChat] = useState([])
  const [pfpUrl, setPfpUrl] = useState('')



  useEffect(() => {
    
    const docRef = doc(db, 'users',userID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          
            const data = docSnapshot.data();

            const pfpURL = data['pfpURL']
            
            if(pfpURL){
            setPfpUrl(pfpURL);
            }
            else{
              setPfpUrl('https://preview.redd.it/default-pfp-v0-1to4yvt3i88c1.png?auto=webp&s=ceae4a63a8aba081b217716078db1a9f8101a3b3')
            }

        } else {
          console.log("Document does not exist");

        }
      },
      (error) => {
        console.error("Error getting document:", error);
        
      }
    );

  

    return () => unsubscribe();
  }, [userID]);



  

  const handleInput = async() => {
    
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{text:userInput}],
      },
    ];

    Keyboard.dismiss()
    setUserMsg(userInput)
    onMesgTyped('')
    setChat(updatedChat)
    setLoading(true)

    try{
      let chatResponse = await charChat(story, updatedChat)

      if(chatResponse){
       
        const updatedChatWithCharacter = [
          ...updatedChat,
          {
            role: "model",
            parts: [{text:chatResponse}],
          },
        ];
      
      setChat(updatedChatWithCharacter);
      setUserMsg("");
      setLoading(false)

      }

    } 
    catch(error) {
    Alert.alert("Something went wrong...")

    }

  }

  const Chats = ({chats, index, totalChats}) => {

    const role = chats.role;
    const isUser = role === "user";
    const isStoryChar = role === "model";
    const recentChat = index === totalChats-1
    return(
    <View>  

    {isUser &&

    <View style={styles.userMsgBox}>
      <View style={styles.userBubble}>
        <Image
        style={{borderRadius:20,width:35,height:35,resizeMode:'cover',padding:10}}
        source={{uri:pfpUrl}}/>
        <Text style={{
          fontFamily:'Contane', color:'white', padding:5, fontSize:14}} >

         {chats.parts[0].text}

        </Text>
      </View>
    </View>
    }
    
    
    {loading && recentChat &&

    <View style={styles.charMsgBox}>
      <View style={styles.charBubble}>
        <Image
        style={{width:40,height:40,resizeMode:'cover',padding:10}}
        source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Character-icon-1.svg/519px-Character-icon-1.svg.png'}}/>
      
        <Text style={styles.typingText}>
                Typing...
        </Text>
        </View>
    </View>
    }

    {isStoryChar &&
    <View style={styles.charMsgBox}>
      <View style={styles.charBubble}>
        <Image
        style={{width:40,height:40,resizeMode:'cover',padding:10}}
        source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Character-icon-1.svg/519px-Character-icon-1.svg.png'}}/>    
         

        <Text style={{
          fontFamily:'Contane', color:'white', padding:5, fontSize:14}} >

          {chats.parts[0].text}

        </Text>
      </View>
    </View>
    }

    {scrollToEnd()}

    </View>
    
    )
  }


  const ChatHeader = () => {
    return(
      <Text style={{fontSize:26, 
        fontFamily:'BetweenDays',
        paddingBottom:180,
        color:'white',
        textAlign:'center',
        lineHeight:40,
        letterSpacing:1,
        textShadowColor:'silver',
        textShadowRadius:10}}
        > 
        {"You're in the Story!\nTalk with the Main Character!"}
      </Text>

    )
  }
  

  const flatListRef = useRef();

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current.scrollToEnd({ animated: true });
    }, 100); // Delay to ensure content is fully rendered
  };


  return (
    <LinearGradient colors={['#030717','#6A0DAD']} style={styles.container}
    start={[1,0]} end={[1,4]}>
      <SafeAreaView>
      <View style={{flexDirection:'row', paddingBottom:20}}>
      <Image
        source={require('../../../../assets/Pictorica_SplashScreen.png')}
        style={styles.headerImage}>
      </Image> 
      <View style={{flex:1, flexDirection:'row', marginStart:-10,justifyContent:'flex-end'}}>
      <Text style={styles.dateText} adjustsFontSizeToFit={true}>
        {`${month} `+`${date}, `+`${year}`}
      </Text>
      </View>
      </View>

      <KeyboardAvoidingView keyboardVerticalOffset={40} behavior={Platform.OS==='ios'? 'padding':'height'}>
       
       <View style={{justifyContent:'flex-end'}}>
       
        <Animated.View entering={ZoomInUp.duration(200)}>
        <ImageBackground
        source={{uri:ImageUri}}
        resizeMode={'cover'}
        imageStyle={{opacity:0.3}}
        style={{ width:Dimensions.get('window').width,
        height: Dimensions.get('window').height - 135, }}>
         <View style={{flex:1,marginTop:10,padding:10}}>
         
           
           
           <FlatList
           data={chat}
           renderItem={({item, index}) => <Chats chats={item} totalChats={chat.length} index={index}/>}
           ListHeaderComponent={ChatHeader}
           ref={flatListRef}
           
           
           />


         </View>

        

        <View style={{flexDirection:'row', backgroundColor:'#070320', margin:10,borderRadius:30}}>
        <TextInput
        style={{textAlignVertical:'top',backgroundColor:'#070320',borderRadius:50,fontSize:16, color:"white", paddingTop:5,marginHorizontal:15,marginVertical:10,width:260}}
        placeholder='Ask about any story incident...'
        placeholderTextColor={'grey'}
        value={userInput}
        onChangeText={onMesgTyped}
        maxLength={200}
        multiline={true}
        />

        <TouchableOpacity onPress={handleInput} style={{marginTop:10}}>
        <Image
        source={require('../../../../assets/sendMesg.png')}
        style={{resizeMode:'contain',width:25,height:25, tintColor:'white'}}/>
        </TouchableOpacity>
        </View>


        </ImageBackground>
        </Animated.View>
        </View>
        
      </KeyboardAvoidingView>
        
        
       </SafeAreaView> 
      </LinearGradient>    
  )
}




const styles = StyleSheet.create({
    container:{
        flex: 1,
      },
      headerImage:{
        marginTop:20,
        width:180,
        height:30,
        marginHorizontal:-10,
        resizeMode:'cover',
        alignSelf:'left'
      },
      dateText:{
    
        textAlignVertical:'center',
        paddingTop:15,
        paddingHorizontal:10,
        fontFamily:'BetweenDays',
        fontSize:20,
        color:'white',
        letterSpacing:0.5,
        textShadowColor:'silver',
        textShadowRadius:10
        
      },
      userMsgBox:{
        flex:1, 
        flexDirection:'row',
        justifyContent:'flex-end',
        marginVertical:20,
      },
      userBubble:{
        flexDirection:'row', 
        padding:10, 
        width:290,
        backgroundColor:'#100320',
        borderRadius:20,
        borderBottomEndRadius:0,
        flexWrap:'wrap',
      },
      charMsgBox:{
        flex:1, 
        flexDirection:'row',
        justifyContent:'flex-start',
        marginVertical:5,
      },
      charBubble:{
        flexDirection:'row', 
        padding:10, 
        width:290,
        backgroundColor:'#070320', 
        borderRadius:20,
        flexWrap:'wrap',
        borderBottomStartRadius:0
      },
      typingText:{
        fontFamily:'Contane', 
        color:'#A9A9A9', 
        padding:5, 
        fontSize:15,
        paddingTop:10,
      }
    })