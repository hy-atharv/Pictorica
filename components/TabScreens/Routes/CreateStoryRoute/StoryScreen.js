import { View, SafeAreaView, TouchableOpacity, Image,StyleSheet, Platform, Dimensions, StatusBar,ScrollView,ActivityIndicator, Text, ImageBackground, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import Animated from 'react-native-reanimated';
import { auth, app } from '../../../../Firebase/firebaseConfig';
import {  doc, getFirestore, getDoc, getDocs,setDoc,collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage"; 
import { storyEmbedding } from '../../../../GeminiAI/GemStoryEmbeds';



const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var date = new Date().getDate()
var month = monthNames[new Date().getMonth()]
var year = new Date().getFullYear()

const db = getFirestore(app)
const storage = getStorage(app)






export default function StoryScreen({navigation, route}) {
    
   const username = auth.currentUser.displayName;

    const {Story,Title,ReadTime,ImageUri,Genre} = route.params

    const lines = Story.split('\n');
    const story = lines.slice(1).join('\n');

    const [loading, setLoading] = useState(false)
    const [actionText, setActionText] = useState('');





 const handlePublish = async()=> {

    const user = auth.currentUser.displayName
    setActionText('Publishing...')

    try{
       setLoading(true)

       const lastDotIndex = ImageUri.lastIndexOf('.');
       const extension = ImageUri.substring(lastDotIndex + 1).toLowerCase();

      // Create a reference to the "stories" folder
      const storiesRef = ref(storage, "stories");

      // Create a reference to the subfolder named "storyTitle"
      const storyRef = ref(storiesRef, Title);

      // Create a reference to the image file within the subfolder
      const imageRef = ref(storyRef, `storyImage.${extension}`); 
      const imgResponse = await fetch(ImageUri);
      const imgBlob = await imgResponse.blob();
      const imgUploadResponse = await uploadBytes(imageRef, imgBlob); 
      console.log("Image uploaded successfully!");
      // Get the download URL
      const imgDownloadURL = await getDownloadURL(imageRef);
      console.log("Download URL:", imgDownloadURL);


      await setDoc(doc(db,'stories',Genre),{
      
      [Title]:
      {
          story: Story,
          imageURL: imgDownloadURL,
          author: user,
          time: ReadTime,
          likes:0,
          impressions:0,
          timestamp: serverTimestamp()
      }
    }, {merge:true});


    await setDoc(doc(db,user,'your works'),{
    
      [Title]:
      {
          story: Story,
          imageURL: imgDownloadURL,
          author: user,
          time: ReadTime,
          likes:0,
          timestamp: serverTimestamp()
      }
    }, {merge:true});


    const storyEmbeds = await storyEmbedding(story, Title);

    await setDoc(doc(db, "storyEmbeds", Title), 
             {
              storyEmbeddings: storyEmbeds
             }
            );



    setLoading(false)


    navigation.goBack(null)

    }
    
    catch(error){
       setLoading(false)
       console.log('ERROR: '+error)
       Alert.alert('Something went wrong..')
    }
    
 }

 const handleKeepInShelf = async()=> {
  
  const user = auth.currentUser.displayName
  setActionText('Moving to Shelf...');

  try{
     
     setLoading(true)

     const lastDotIndex = ImageUri.lastIndexOf('.');
     const extension = ImageUri.substring(lastDotIndex + 1).toLowerCase();


    const storiesRef = ref(storage, user);


    const storyRef = ref(storiesRef, Title);


    const imageRef = ref(storyRef, `storyImage.${extension}`); 
    const imgResponse = await fetch(ImageUri);
    const imgBlob = await imgResponse.blob();
    const imgUploadResponse = await uploadBytes(imageRef, imgBlob); 
    console.log("Image uploaded successfully!");
    // Get the download URL
    const imgDownloadURL = await getDownloadURL(imageRef);
    console.log("Download URL:", imgDownloadURL);


    await setDoc(doc(db,user,'your works'),{
    
    [Title]:
    {
        story: Story,
        imageURL: imgDownloadURL,
        author: user,
        time: ReadTime,
        likes:0,
        timestamp: serverTimestamp()
    }
  }, {merge:true});

  setLoading(false)

  

  navigation.goBack(null)
  }
  catch(error){
     setLoading(false)
     console.log('ERROR: '+error)
     Alert.alert('Something went wrong..')
  }

 }




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
       
       <Animated.View>

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
        <Text style={styles.readTimeText}>
         {"( "+ReadTime+" )"}
        </Text>
        </View> 
        
        

        <Image
        source={{uri: ImageUri}}
        style={styles.storyImage}
        />
        
        <View style={styles.storyContainer}>
        <ScrollView>

            <Text style={styles.storyText}>
                {story}
            </Text>

        </ScrollView>
        </View>

        
        <View style={{flexDirection:'row'}}>
        <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={styles.Button}>
        <TouchableOpacity onPress={handleKeepInShelf}>
          <Text style={styles.ButtonText}>
            Keep it in Shelf
          </Text>
        </TouchableOpacity>
        </LinearGradient>

        <LinearGradient colors={['#6A0DAD','#26256B',]}
        style={styles.Button}>
        <TouchableOpacity onPress={handlePublish}>
          <Text style={styles.ButtonText}>
            Publish
          </Text>
        </TouchableOpacity>
        </LinearGradient>
        </View>
        
        

        </ImageBackground>

       </Animated.View>
       {loading &&
         <View
         style={{position:'absolute', 
         height:Dimensions.get('window').height, 
         width:Dimensions.get('window').width, 
         alignSelf:'center', 
         justifyContent:'center',
         backgroundColor:'black', 
         opacity:0.9}}>
          <ActivityIndicator
          style={{marginTop:-20}}
          size='large'
          color='#6A0DAD'/>
         <Text style={{fontFamily:'Contane', color:'white', textAlign:'center',fontSize:20}}>
          {actionText}
         </Text>
         
         
         </View>
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
        color:'black'

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
        marginHorizontal:30,
        borderRadius:30,
        marginTop:10,
      },
      ButtonText:{
        fontFamily:'ArsenicaTrial-Regular',
        fontSize:15, 
        paddingHorizontal:10,
        color:'white',
      }
})