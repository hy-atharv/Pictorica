import { View, SafeAreaView, TouchableOpacity, Image,StyleSheet, Platform, Dimensions, StatusBar,ScrollView, Text, ImageBackground, Alert } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInUp, runOnJS } from 'react-native-reanimated';
import { setDoc,doc,getFirestore, serverTimestamp, increment, updateDoc, onSnapshot, deleteField } from 'firebase/firestore';
import { app,auth } from '../../../../Firebase/firebaseConfig';
import * as Speech from 'expo-speech';
import { Gesture,GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var date = new Date().getDate()
var month = monthNames[new Date().getMonth()]
var year = new Date().getFullYear()


const db = getFirestore(app)






export default function LibStoryScreen({ navigation, route }) {
  const user = auth.currentUser.displayName;
  const { Story, Title, Author, ReadTime, Genre, ImageUri } = route.params;

  const [likeHeart, setHeart] = useState(false);
  const [saveIcon, setSaveIcon] = useState(false);
  const [storyLike, setStoryLike] = useState(false);
  const [storySaved, setSaveStory] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [savedIndex, setSavedIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [audioLoaded, setAudioLoad] = useState(false);
  const [partIndex, setPartIndex] = useState(0);
  const timerRef = useRef(null);

  
  const lines = Story.split('\n');
  let story = lines.slice(1).join('\n');

  fullText = `You are listening to "${Title}" by "${Author}"\n${story}`;
  const words = fullText.split(' ');


  useEffect(() => {
    
    const docRef = doc(db, 'userActivity', user);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          try {
            const data = docSnapshot.data();
            if(data[Title]){
            const liked = data[Title].liked;
            const saved = data[Title].saved;
  
            setStoryLike(liked);
            setSaveStory(saved);
            }

          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Document does not exist");

        }
      },
      (error) => {
        console.error("Error getting document:", error);
        setStoryLike(false);
        setSaveStory(false);
      }
    );


    const unsubscribeNav = navigation.addListener('beforeRemove', () => {
      Speech.stop();
    });

  

    return () => unsubscribe(), unsubscribeNav;
  }, [user, navigation]);



  const startSpeech = (text, index, Words, partIndex) => {
    Speech.VoiceQuality.Enhanced = 'Enhanced';
    setSavedIndex(index);
    
    Speech.speak(text, {
      rate: 0.90,
      onDone: () => {
        console.log("TEXT COMPLETED !!");
  
        if (partIndex < 2) {
          const nextPartIndex = partIndex + 1;
          const partSize = Math.ceil(Words.length / 3);
          const nextPartText = Words.slice(nextPartIndex * partSize, (nextPartIndex + 1) * partSize).join(' ');
          
          setCurrentText(nextPartText);
          startSpeech(nextPartText, index, Words, nextPartIndex);
        } else {
          setIsPaused(true);
          setAudioLoad(false);
        }
      },
      onStopped: () => setIsPaused(true),
    });
    
    setIsPaused(false);
    setAudioLoad(true);
  
    timerRef.current = setInterval(() => {
      setSavedIndex(prevIndex => prevIndex + 1);
    }, 500);
  };
  
  const startFullSpeech = (Words, savedIndex) => {
    clearInterval(timerRef.current);
    setPartIndex(0);
  
    const partSize = Math.ceil(Words.length / 3);
    const firstPartText = Words.slice(0, partSize).join(' ');
  
    setCurrentText(firstPartText);
    startSpeech(firstPartText, savedIndex, Words, 0);
  };
  
  const pauseSpeech = () => {
    Speech.stop();
    setIsPaused(true);
    clearInterval(timerRef.current);
  };
  
  const resumeSpeech = () => {
    if (isPaused) {
      const remainingWords = words.slice(savedIndex);
      startFullSpeech(remainingWords, savedIndex);
    }
  };
  
  const handlePlayer = () => {
    if (!audioLoaded) {
      startFullSpeech(words, 0);
    } else if (audioLoaded && !isPaused) {
      pauseSpeech();
    } else if (audioLoaded && isPaused) {
      resumeSpeech();
    }
  };
  

  const handleSaved = async() => {
    if (!storySaved && !storyLike) {

      try{
        await setDoc(doc(db,user,'saved'),{
    
          [Title]:
          {
              story: Story,
              imageURL: ImageUri,
              author: user,
              genre: Genre,
              time: ReadTime,
              timestamp: serverTimestamp()
          }
        }, {merge:true});


        await setDoc(doc(db, 'userActivity', user), {
          [`${Title}`]: {
            liked: false,
            saved: true,
          },
        });
      }catch(error){
        console.log(error)
        Alert.alert('Something went wrong..')
      }

      setSaveIcon(true);
      setTimeout(() => {
        setSaveIcon(false);
      }, 2000);
    }
    else if (!storySaved && storyLike) {
      try {
        await setDoc(doc(db,user,'saved'),{
    
          [Title]:
          {
              story: Story,
              imageURL: ImageUri,
              author: user,
              genre: Genre,
              time: ReadTime,
              timestamp: serverTimestamp()
          }
        }, {merge:true});

        await updateDoc(doc(db, 'userActivity', user), {
          [`${Title}.saved`]: true,
        });
      } catch (error) {
        console.log(error);
        Alert.alert('Something went wrong..');
      }

      setSaveIcon(true);
      setTimeout(() => {
        setSaveIcon(false);
      }, 2000);
    
    }
    else if (storySaved) {
      try {
        
        await updateDoc(doc(db,user,'saved'), {
          [Title]: deleteField(),
        })
        await updateDoc(doc(db, 'userActivity', user), {
          [`${Title}.saved`]: false,
        });
      } catch (error) {
        console.log(error);
        Alert.alert('Something went wrong..');
      }
    }
  };



  const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart( () => {
    console.log('Double Tap Liked!')
    handleLike();
  })
  .runOnJS(true) //IMPORTANT
  

  const handleLike = async () => {
    if (!storyLike && !storySaved) {
      try {
        await updateDoc(doc(db, 'stories', Genre), {
          [`${Title}.likes`]: increment(1),
        });

        await setDoc(doc(db, 'userActivity', user), {
          [`${Title}`]: {
            liked: true,
            saved: false,
          },
        }, {merge:true});

        setHeart(true);
        setTimeout(() => {
          setHeart(false);
        }, 2000);
      } catch (error) {
        console.log(error);
        Alert.alert('Something went wrong..');
      }
    }
    else if (!storyLike && storySaved) {
      try {
        await updateDoc(doc(db, 'stories', Genre), {
          [`${Title}.likes`]: increment(1),
        });

        await updateDoc(doc(db, 'userActivity', user), {
          [`${Title}.liked`]: true,
        });
      } catch (error) {
        console.log(error);
        Alert.alert('Something went wrong..');
      }

      setHeart(true);
        setTimeout(() => {
          setHeart(false);
        }, 2000);

    } else if (storyLike) {
      try {

        await updateDoc(doc(db, 'stories', Genre), {
          [`${Title}.likes`]: increment(-1),
        });

        await updateDoc(doc(db, 'userActivity', user), {
          [`${Title}.liked`]: false,
        });
      } catch (error) {
        throw error
        console.log(error);
        Alert.alert('Something went wrong..');
      }
    }
  };

  const handleChat = () => {
    navigation.navigate('MainCharacter', { ImageUri: ImageUri, story: story });
  };


  const handleAuthorProfile = () => {
    if(user === Author){
      navigation.navigate('YourProfile')
    }
    else {
      navigation.navigate('AuthorProfile',{username:Author})
    }
  }



  return (
    <GestureHandlerRootView style={{flex:1}}>
      <GestureDetector
      gesture={doubleTap}>
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
       
        
       
        <ImageBackground
        source={require('../../../../assets/arts/storyArt.png')}
        resizeMode={'cover'}
        imageStyle={{opacity:0.8}}
        style={{ width:Dimensions.get('window').width,
        height: Dimensions.get('window').height - 140, }}>
          
        

        <View style={{backgroundColor:"#f6eee3",}}>
        <Text style={styles.storyTitle}>
          {Title}
        </Text>
        <View style={{flexDirection:'row', marginHorizontal:20}}>
        <Text style={styles.readTimeText} >
         {"( "+ReadTime+" )"}
        </Text>
        
        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
        <TouchableOpacity onPress={handleAuthorProfile}>
        <Text style={styles.authorText}>
         {"~ "+Author}
        </Text>
        </TouchableOpacity>
        </View>
        
        </View>
        </View> 
        
        
        
        <ImageBackground
        source={{uri: ImageUri}}
        style={styles.storyImage}
        imageStyle={{borderRadius:5}}>

        <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={{height:40, width:40, borderRadius:20,alignSelf:'center', marginTop:115,justifyContent:'center'}}>
        <TouchableOpacity onPress={handlePlayer}>
          <Image
          source={isPaused ? require('../../../../assets/playAudioIcon.png') : require('../../../../assets/pauseAudioIcon.png') }
          style={{marginLeft: isPaused?5:0,width:18, height:18, resizeMode:'contain',padding:5, 
          tintColor: isPaused?'white':'pink', alignSelf:'center'}}/>
        </TouchableOpacity>
        </LinearGradient>
        </ImageBackground>
        
        <View style={styles.storyContainer}>
        <ScrollView>

            <Text style={styles.storyText}>
            {story}
            </Text>

        </ScrollView>
        </View>

        
        <View style={{flexDirection:'row'}}>
        <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={{height:40, width:40, borderRadius:20,alignSelf:'center', marginLeft:20, marginTop:10,justifyContent:'center'}}>
        <TouchableOpacity onPress={handleLike}>
          <Image
          source={require('../../../../assets/likeStoryIcon.png') }
          style={{width:22, height:22, resizeMode:'contain',padding:5, 
          tintColor: storyLike?'pink':'white', alignSelf:'center'}}/>
        </TouchableOpacity>
        </LinearGradient>

        <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={{height:40, width:40, borderRadius:20,alignSelf:'center', marginHorizontal:20, marginTop:10,justifyContent:'center'}}>
        <TouchableOpacity onPress={handleSaved}>
          <Image
          source={require('../../../../assets/saveStoryIcon.png') }
          style={{width:20, height:20, resizeMode:'contain',padding:5, 
          tintColor: storySaved?'pink':'white', alignSelf:'center'}}/>
        </TouchableOpacity>
        </LinearGradient>

        <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={{height:40,width:180, borderRadius:20,marginLeft:30,marginTop:10,justifyContent:'center'}}>
        <TouchableOpacity onPress={handleChat}>
          <View style={{flexDirection:'row', padding:10,}}>
          <Image
          source={require('../../../../assets/talkIcon.png') }
          style={{width:25, height:25, resizeMode:'contain',padding:5, 
          tintColor: 'white', alignSelf:'center'}}/>
          <Text style={{alignSelf:'center', color:'white', fontSize:14, fontFamily:'BetweenDays', marginLeft:6}}>
            Ask Main Character
          </Text>
          </View>
        </TouchableOpacity>
        </LinearGradient>

        

        

        </View>
        
        
        
        </ImageBackground>

        
        
        

        
        {likeHeart &&
        
        <View
         style={{position:'absolute', 
         height:Dimensions.get('window').height, 
         width:Dimensions.get('window').width, 
         alignSelf:'center', 
         justifyContent:'center',
         backgroundColor:'black', 
         marginTop:-30,
         opacity:0.9}}>
          
         <Animated.Image entering={FadeInUp.duration(1000)}
         source={{uri:"https://cdn-icons-png.flaticon.com/512/4009/4009793.png"}}
         style={{tintColor:'pink',resizeMode:'contain',height:200, width:200,alignSelf:'center'}}/>
         </View>
       
        }
       
        {saveIcon &&
        
        <View
         style={{position:'absolute', 
         height:Dimensions.get('window').height, 
         width:Dimensions.get('window').width, 
         alignSelf:'center', 
         marginTop:-30,
         justifyContent:'center',
         backgroundColor:'black', 
         opacity:0.9}}>
          
         <Animated.Image entering={FadeInUp.duration(1000)}
         source={{uri:"https://cdn-icons-png.freepik.com/512/33/33277.png"}}
         style={{tintColor:'pink',resizeMode:'contain',height:170, width:170,alignSelf:'center'}}/>
         </View>
       
        }


      </SafeAreaView>
    </LinearGradient>
    </GestureDetector>
    </GestureHandlerRootView>
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
      storyTitle:{
        fontFamily:'BetweenDays',
        fontSize:19,
        color:'black',
        textAlign:'center',
        padding:8,

      },

      readTimeText:{
        fontFamily:'BetweenDays',
        textAlign:'center',
        fontSize:13,
        color:'black',

      },
      authorText:{
        fontFamily:'BetweenDays',
        textAlign:'center',
        fontSize:15,
        color:'black',

      },

      storyImage:{
        width:170,
        height:160,
        resizeMode:'cover',
        alignSelf:'center',
        borderRadius:5
      },
      storyContainer:{
        marginTop:10,
        height:300,
        marginLeft:10,
      },
      storyText:{
        padding:15,
        fontFamily:'Contane',
        fontSize:16,
        color:'black'
      },
      Button:{
        padding:10,
        marginHorizontal:0,
        borderRadius:30,
        marginTop:10,
        justifyContent:'center',
      },
      ButtonText:{
        fontFamily:'ArsenicaTrial-Regular',
        fontSize:15, 
        paddingHorizontal:10,
        color:'white',
      }
})