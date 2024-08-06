import { View, Text, SafeAreaView, Image, ScrollView, StyleSheet, Platform, StatusBar, ImageBackground, Dimensions, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import Animated, { FadeInDown, Easing, withSequence, useAnimatedStyle, useSharedValue, withRepeat, withTiming, } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker'
import { geminiImgDesc } from '../../GeminiAI/GemImageDesc';
import { geminiStoryGen } from '../../GeminiAI/GemStoryGen';
import { geminiStoryTitle } from '../../GeminiAI/GemStoryGen';



const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var date = new Date().getDate()
var month = monthNames[new Date().getMonth()]
var year = new Date().getFullYear()

const ANGLE = 5;
const TIME = 300;
const EASING = Easing.elastic(0);



export default function CreateStoryScreenScreen({navigation}) {

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  React.useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        // deviate left to start from -ANGLE
        withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
        // wobble between -ANGLE and ANGLE 7 times
        withRepeat(
          withTiming(ANGLE, {
            duration: TIME,
            easing: EASING,
          }),
          7,
          true
        ),
        // go back to 0 at the end
        withTiming(0, { duration: TIME / 2, easing: EASING })
      ),
      -1, // -1 indicates infinite repetition
      false // `true` for alternating, `false` for repeating in the same direction
    );
}, []);


  


useEffect( ()=> {
  navigation.addListener('focus', ()=> {
    setImage()
    genreChange('')
    setImageDesc('')
    onAuthorTyped('')
    onMainCharTyped('')
    onStoryDescTyped('')
    onTitleTyped('')
  });
}, [navigation]);



 const [genre,genreChange] = useState('')
 const [image, setImage] = useState()
 const [imgLoading, setImgLoading] = useState(false)
 const [imgDesc, setImageDesc] = useState('')
 const [author, onAuthorTyped]= useState('')
 const [mainChar, onMainCharTyped] = useState('')
 const [storyDesc, onStoryDescTyped] = useState('')
 const [title, onTitleTyped]= useState('')
 const [generating, setGenerating] = useState(false)



 const handleGenreChosen = (genre) => {
  genreChange(genre)
 }



 const uploadImage = async () =>{
  try{

    let resultImage = {}
    await ImagePicker.
    requestMediaLibraryPermissionsAsync();
    resultImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.
      Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    });

    if(!resultImage.canceled) {
      
      await saveImage(resultImage.assets[0].uri);
       
    }

  } catch (error){
    console.log(error)
    throw error
    Alert.alert('Something went wrong\n'+error)
  }
 }

 const saveImage = async (image) => {
    try {
      setImage(image)
      setImgLoading(true)
      let desc = await geminiImgDesc(image, genre)
      setImageDesc(desc)
      setImgLoading(false)
      
      console.log(image)
    } catch(error) {
      console.log(error)
    }
 }


 const handleGen = async () => {

   let defTitle = ''

   try{
    if( genre && image && storyDesc){
     
      setGenerating(true)

      if(!author){
        onAuthorTyped('any relevant & appropriate Author you can think of')
      }
      else if(!mainChar){
        onMainCharTyped('any relevant & appropriate Character you can think of')
      }
      else if(!title){
        defTitle = 'any relevant & appropriate Title you can think of'
      }
      else if(title){
        defTitle = title
      }
      
      let story = await geminiStoryGen(genre,image,author,mainChar,storyDesc,defTitle)
      
      //SANITIZING JSON STRING
      // story = story.replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
      // story = story.replace(/[\u2028\u2029]/g, '')
      // story = story.replace(/'/g, '"')

      let storyTitleAndReadTime = await geminiStoryTitle(story)
      
      let TRstring = storyTitleAndReadTime.replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")


      let titleReadTimeObject = JSON.parse(TRstring)

      let genTitle = title ? title : titleReadTimeObject["Title"]
      let readTime = titleReadTimeObject["Reading_Time"]

      


      setGenerating(false)

      navigation.navigate('StoryScreen', 
               {Story: story, 
                Title: genTitle, 
                ReadTime: readTime, 
                ImageUri:image,
                Genre: genre})
    }
   } catch(error){
    setGenerating(false)
    console.log(error)
    Alert.alert('Something went wrong..\nTry again')
   }


 }






  return (

    
    
    <LinearGradient colors={['#030717','#6A0DAD']} style={styles.container}
    start={[1,0]} end={[1,4]}>
      
      
      <SafeAreaView>
      

      <View style={{flexDirection:'row', paddingBottom:20}}>
      <Image
        source={require('../../assets/Pictorica_SplashScreen.png')}
        style={styles.headerImage}>
      </Image> 
      <View style={{flex:1, flexDirection:'row', marginStart:-10,justifyContent:'flex-end'}}>
      <Text style={styles.dateText} adjustsFontSizeToFit={true}>
        {`${month} `+`${date}, `+`${year}`}
      </Text>
      </View>
      </View>
      
      <KeyboardAvoidingView keyboardVerticalOffset={20} behavior={Platform.OS==='ios'? 'padding':'height'}>
      <View style={{justifyContent:'flex-end'}}>
      
       <Animated.View entering={FadeInDown.duration(1000)}>
       
       

       <ImageBackground
       source={require('../../assets/arts/createStoryArt.jpeg')}
       resizeMode={'cover'}
       imageStyle={{opacity:0.3}}
       style={{ width:Dimensions.get('window').width,
       height: Dimensions.get('window').height - 140, paddingVertical:10}}>
        
       
        <ScrollView keyboardDismissMode={'on-drag'}
        style={{flex:1}}>
        
        <Text adjustsFontSizeToFit={true}
        style={styles.createStoryHeaderText}>
          Create your PicStory
        </Text>

        <Text style={styles.chooseGenreText}>
          {'Step-1\nChoose your PicStory Genre:'}
        </Text>
        
        <ScrollView style={{flex:1, paddingTop:10, paddingBottom:10, paddingHorizontal:5}} horizontal={true}>
        
        <Pressable 
        onPress={() => handleGenreChosen('fantasy')}>
        <View style={{paddingHorizontal:5, 
          borderColor: '#6A0DAD', 
          borderWidth: genre==='fantasy'?3:0,
          borderRadius:10
          }}>
          <Image source={{uri:'https://s26162.pcdn.co/wp-content/uploads/2023/09/fantasy-8094384_1280.jpg'}}
            style={styles.genreImage}>
          </Image>
          <Text style={styles.genreName}>
            Fantasy
          </Text>
        </View>
        </Pressable>

        <Pressable
        onPress={() => handleGenreChosen('horror')}>
        <View style={{paddingHorizontal:5,
          borderColor: '#6A0DAD', 
          borderWidth: genre==='horror'?3:0,
          borderRadius:10
        }}>
          <Image source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Paul_Gustave_Dore_Raven1.jpg/220px-Paul_Gustave_Dore_Raven1.jpg'}}
            style={styles.genreImage}>
          </Image>
          <Text style={styles.genreName}>
            Horror
          </Text>
        </View>
        </Pressable>

        <Pressable
        onPress={() => handleGenreChosen('adventure')}>
        <View style={{paddingHorizontal:5,
          borderColor: '#6A0DAD', 
          borderWidth: genre==='adventure'?3:0,
          borderRadius:10
        }}>
          <Image source={{uri:'https://upload.wikimedia.org/wikipedia/commons/8/8c/ThrillingAdventuresVol2No3.jpg'}}
            style={styles.genreImage}>
          </Image>
          <Text style={styles.genreName}
          multiline={true}>
            Adventure
          </Text>
        </View>
        </Pressable>

        <Pressable
        onPress={() => handleGenreChosen('drama')}>
        <View style={{paddingHorizontal:5,
          borderColor: '#6A0DAD', 
          borderWidth: genre==='drama'?3:0,
          borderRadius:10
        }}>
          <Image source={{uri:'https://m.media-amazon.com/images/I/816yHUNskLL._AC_UF1000,1000_QL80_.jpg'}}
            style={styles.genreImage}>
          </Image>
          <Text style={styles.genreName}>
            Drama
          </Text>
        </View>
        </Pressable>

        <Pressable
        onPress={() => handleGenreChosen('crime')}>
        <View style={{paddingHorizontal:5,
          borderColor: '#6A0DAD', 
          borderWidth: genre==='crime'?3:0,
          borderRadius:10
        }}>
          <Image source={{uri:'https://upload.wikimedia.org/wikipedia/commons/c/cb/The_Adventure_of_the_Empty_House_-_The_Arrest_of_Colonel_Moran.jpg'}}
            style={styles.genreImage}>
          </Image>
          <Text style={styles.genreName}>
            Crime
          </Text>
        </View>
        </Pressable>

        <Pressable
        onPress={() => handleGenreChosen('mystery')}>
        <View style={{paddingHorizontal:5,
          borderColor: '#6A0DAD', 
          borderWidth: genre==='mystery'?3:0,
          borderRadius:10
        }}>
          <Image source={{uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Mystery_January_1934.jpg/220px-Mystery_January_1934.jpg'}}
            style={styles.genreImage}>
          </Image>
          <Text style={styles.genreName}>
            Mystery
          </Text>
        </View>
        </Pressable>
        
        <Pressable
        onPress={() => handleGenreChosen('mythology')}>
        <View style={{paddingHorizontal:5,
          borderColor: '#6A0DAD', 
          borderWidth: genre==='mythology'?3:0,
          borderRadius:10
        }}>
          <Image source={{uri:'https://media.mythopedia.com/5F5VdN4l2NttE4GsSzI6MS/4b3150d0cae6466da2e1850138a71b26/perseus-and-andromeda-by-pierre-mignard-I-1679-louvre-detail.jpg'}}
            style={styles.genreImage}>
          </Image>
          <Text style={styles.genreName}>
            Mythology
          </Text>
        </View>
        </Pressable>
        
        <Pressable
        onPress={() => handleGenreChosen('sci-fi')}>
        <View style={{paddingHorizontal:5,
          borderColor: '#6A0DAD', 
          borderWidth: genre==='sci-fi'?3:0,
          borderRadius:10
        }}>
          
          <Image source={{uri:'https://cdn.britannica.com/09/92009-050-122EC720/Enterprise-from-Star-Trek-III-The-Search.jpg'}}
            style={styles.genreImage}
            >
          </Image>
          <Text style={styles.genreName}>
            Sci-Fi
          </Text>
        </View>
        </Pressable>

        </ScrollView>

        <Text style={styles.chooseGenreText}>
          {'Step-2\nChoose your PicStory Picture/Cover:'}
        </Text>

        <TouchableOpacity onPress={uploadImage}>
        <View style={{paddingTop:10, alignItems:'center',}}>
          <Image
          style={{width: image?120:60, height: image?170:60, resizeMode:'cover',backgroundColor:'grey', borderWidth:1, borderRadius:10}}
          source={image ? {uri:image} : require('../../assets/CameraIcon.png')}/>
        </View>
        </TouchableOpacity>


        <View style={{
          flexDirection:'row', padding:10, margin:10, backgroundColor:'#070320', borderRadius:15,
          flexWrap:'wrap'
        }}>
          <Image
          style={{width:30,height:30,resizeMode:'cover',padding:10}}
          source={require('../../assets/BottomTabIcons/createIcon.png')}/>

          {image ?
            imgLoading ?
            <ActivityIndicator
            size={'large'}
            color={'#6A0DAD'}
            style={{marginHorizontal:110}}/>

            :

            <Text style={{
              fontFamily:'Contane', color:'white', padding:5, fontSize:16
              }}>
                {imgDesc}
            </Text>
            

             :
            
            <Text style={{
             fontFamily:'Contane', color:'white', padding:5, fontSize:16
             }}>
             {"The above Image will be your Book Cover.\nChoose captivating art or a picture to attract readers.\n\nAvoid Images/Arts with Human Faces to protect Privacy."}
            </Text>
          }

        </View>

        <Text style={styles.chooseGenreText}>
          {'Step-3\nInspired by any Author (optional):'}
        </Text>
        <TextInput
        style={{backgroundColor:'#070320',fontSize:16, color:"white", padding:10, width:300,margin:10,borderRadius:15}}
        placeholder='Ex: Agatha Christie'
        placeholderTextColor={'grey'}
        value={author}
        onChangeText={onAuthorTyped}
        maxLength={40}
        />

        <Text style={styles.chooseGenreText}>
          {'Step-4\nMain Character (optional):'}
        </Text>

        <TextInput
        style={{textAlignVertical:'top',backgroundColor:'#070320',fontSize:16, color:"white", padding:10, marginHorizontal:10,margin:10,borderRadius:15}}
        placeholder='Ex: A boy named Peter living in a middle class family & having a pet dog'
        placeholderTextColor={'grey'}
        value={mainChar}
        onChangeText={onMainCharTyped}
        maxLength={100}
        multiline={true}
        />

        <Text style={styles.chooseGenreText}>
          {'Step-5\nBrief Description of your story:'}
        </Text>

        <TextInput
        style={{textAlignVertical:'top', backgroundColor:'#070320',fontSize:16, justifyContent:'flex-start',color:"white", padding:10, marginHorizontal:10,margin:10,borderRadius:15}}
        placeholder={'A rough story idea or you can maybe divide it in 5 phases:\n\nOpener\nIncident\nCrisis\nClimax\nEnding'}
        placeholderTextColor={'grey'}
        value={storyDesc}
        onChangeText={onStoryDescTyped}
        maxLength={1000}
        multiline={true}
        />

        <Text style={styles.chooseGenreText}>
          {'Step-6\nTitle of your story (optional):'}
        </Text>

        <TextInput
        style={{textAlignVertical:'top', backgroundColor:'#070320',fontSize:16, justifyContent:'flex-start',color:"white", padding:10, marginHorizontal:10,margin:10,borderRadius:15}}
        placeholder={'Ex: The Fallen Empire'}
        placeholderTextColor={'grey'}
        value={title}
        onChangeText={onTitleTyped}
        maxLength={30}
        multiline={true}
        />






        <LinearGradient colors={['#26256B','#6A0DAD']}
        style={styles.genBut}>
        <TouchableOpacity onPress={handleGen}>
          <Text style={{fontFamily:'ArsenicaTrial-Regular',fontSize:22,color:'white'}}>
            Generate
          </Text>
        </TouchableOpacity>
        </LinearGradient>

        </ScrollView>
        
       </ImageBackground>
    
       </Animated.View>
       </View>
       </KeyboardAvoidingView>
       
       

       

       {generating &&
         <View
         style={{position:'absolute', 
         height:Dimensions.get('window').height, 
         width:Dimensions.get('window').width, 
         alignSelf:'center', 
         justifyContent:'center',
         backgroundColor:'black', 
         opacity:0.9}}>
         <Animated.View style={[styles.box, animatedStyle]}>
         <Image
         style={{width:100, height:100, alignSelf:'center', marginTop:-50}}
         source={require('../../assets/BottomTabIcons/createIcon.png')}>
         </Image>
         </Animated.View>
         <Text style={{fontFamily:'Contane', color:'white', textAlign:'center',fontSize:20, marginTop:10}}>
          Writing...
         </Text>
         
         
         </View>
        }

      </SafeAreaView>

    </LinearGradient>



  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
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
  createStoryHeaderText:{
    textAlign:'center',
    opacity:1,
    fontSize:30,
    paddingTop:0,
    paddingLeft:10,
    paddingBottom:10,
    color:'white',
    fontFamily:'BetweenDays',
    textShadowColor:'silver',
    textShadowRadius:10
  },

  chooseGenreText:{
    textAlign:'left',
    opacity:1,
    fontSize:18,
    paddingTop:50,
    paddingLeft:10,
    lineHeight:25,
    color:'white',
    fontFamily:'BetweenDays'
  },
  genreImage:{
    width:120, 
    height:120, 
    resizeMode:'cover', 
    borderRadius:10
  },
  genreName:{
    fontFamily:'Contane',
    fontSize:15,
    color:'white',
    textAlign:'center',
    paddingTop:5,
    
  },
  genBut:{
    marginTop:20,
    padding:10,
    marginHorizontal:100,
    borderRadius:30,
    alignItems:'center',
    shadowColor:'#6A0DAD',
    marginBottom:50,
    elevation:5,
  }
  
})

