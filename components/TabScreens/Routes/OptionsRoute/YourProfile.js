import { View, Text,Image, TouchableOpacity,TextInput, SafeAreaView,KeyboardAvoidingView, StyleSheet, Platform, StatusBar, ImageBackground, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect} from 'react'
import * as ImagePicker from 'expo-image-picker'
import { app, auth } from '../../../../Firebase/firebaseConfig'
import {  doc, getFirestore, updateDoc, getDoc,onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage"; 


const db = getFirestore(app);
const storage = getStorage(app);





export default function YourProfile() {

    const user = auth.currentUser.displayName;
    const userId = auth.currentUser.uid;

    const [image, setImage] = useState('https://preview.redd.it/default-pfp-v0-1to4yvt3i88c1.png?auto=webp&s=ceae4a63a8aba081b217716078db1a9f8101a3b3');
    
    const [isEditAbout,setEditAbout] = useState(false);
    const [about, onAboutTyped] = useState('');

    const [bookCount, setBookCount] = useState(0);
    const [followCount, setFollowCount] = useState(0);

    const [bookDisplayCount, setBookDisplayCount] = useState(0);
    const [followDisplayCount, setFollowDisplayCount] = useState(0);





    useEffect(() => {
    
        const docRef = doc(db, 'users',userId);
        const unsubscribe = onSnapshot(
          docRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              
                const data = docSnapshot.data();
    
                const pfpURL = data['pfpURL']
                const aboutUser = data['aboutMe']
                const followers = data['followers']

                setFollowCount(followers);
                
                if(pfpURL){
                setImage(pfpURL);
                }
                else{
                  setImage('https://preview.redd.it/default-pfp-v0-1to4yvt3i88c1.png?auto=webp&s=ceae4a63a8aba081b217716078db1a9f8101a3b3')
                }

                if(aboutUser){
                onAboutTyped(aboutUser);
                }
                else{
                    onAboutTyped('');
                }
    
            } else {
              console.log("Document does not exist");
    
            }
          },
          (error) => {
            console.error("Error getting document:", error);

          }
        );

        const countBooks = async () => {
            try {
              const userDocRef = doc(db, user, 'your works');
              const userDoc = await getDoc(userDocRef);
      
              if (userDoc.exists()) {
                const data = userDoc.data();
                const fieldCount = Object.keys(data).length;
                setBookCount(fieldCount);
              } else {
                console.log('No such document!');
              }
            } catch (error) {
              console.error('Error counting fields:', error);
            }
          };

          countBooks();
      

        return () => unsubscribe();
      }, [userId, user]);


    



const onEditPfp = async () =>{
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


        const lastDotIndex = image.lastIndexOf('.');
        const extension = image.substring(lastDotIndex + 1).toLowerCase();


        const storiesRef = ref(storage, "users");


        const storyRef = ref(storiesRef, user);

      
        const imageRef = ref(storyRef, `userProfile.${extension}`); 
        const imgResponse = await fetch(image);
        const imgBlob = await imgResponse.blob();
        const imgUploadResponse = await uploadBytes(imageRef, imgBlob); 
        console.log("Image uploaded successfully!");

        const imgDownloadURL = await getDownloadURL(imageRef);
        
        await updateDoc(doc(db,"users",userId),
                    {
                      pfpURL: imgDownloadURL,
                    });
        
        console.log(image)
      } catch(error) {
        console.log(error)
      }
   }

  const onEditAbout = async() => {
    setEditAbout(!isEditAbout);
    
    if(isEditAbout){
      try{
        await updateDoc(doc(db,"users",userId),
                    {
                      aboutMe: about,
                    });
        
      } catch(error) {
        console.log(error)
      }
    }
  }


  useEffect(() => {
    if (bookCount !== null && followCount !== null) {
      let currentBookCount = 0;
      let currentFollowCount = 0;
      const interval = setInterval(() => {
        let updated = false;
        
        // Update book count if it's less than the target
        if (currentBookCount < bookCount) {
          currentBookCount += 1;
          setBookDisplayCount(currentBookCount);
          updated = true;
        }
        
        // Update follow count if it's less than the target
        if (currentFollowCount < followCount) {
          currentFollowCount += 1;
          setFollowDisplayCount(currentFollowCount);
          updated = true;
        }
        
        // If no updates were made, clear the interval
        if (!updated) {
          clearInterval(interval);
        }
      }, 50);
      
      // Clear the interval on component unmount
      return () => clearInterval(interval);
    }
  }, [bookCount, followCount]);


    return (
        <LinearGradient colors={['#030717','#6A0DAD']} style={styles.container}
        start={[1,0]} end={[1,4]}>
          <SafeAreaView>

       <KeyboardAvoidingView keyboardVerticalOffset={20} behavior={Platform.OS==='ios'? 'padding':'height'}>
       
       <View style={{justifyContent:'flex-end'}}>
          <View style={{paddingBottom:40}}>
          <Image
            source={require('../../../../assets/Pictorica_SplashScreen.png')}
            style={styles.headerImage}>
          </Image> 
          </View>

        

          <View>
            <ImageBackground
            style={styles.profilePhoto}
            imageStyle={{borderRadius:80}}
            source={{uri:image}}>
                <TouchableOpacity onPress={onEditPfp} >
                    <View style={{height:40, width:40, 
                        backgroundColor:'#000320', 
                        justifyContent:'center', 
                        alignSelf:'center',
                        marginTop:120,
                        borderRadius:20}}>
                    <Image
                    style={{tintColor:'#6A0DAD', 
                    width:20, 
                    height:20, 
                    resizeMode:'contain',
                    alignSelf:'center'}}
                    source={require('../../../../assets/editIcon.png')}/>
                    </View>
                </TouchableOpacity>
            </ImageBackground>
          </View>


        <Text style={styles.usernameText}>
          {user}
        </Text>

        <View style={{flexDirection:'row'}}>
        <Text style={styles.aboutSectionText}>
          About
        </Text>
        
        <TouchableOpacity onPress={onEditAbout} >
                    <View style={{height:40, width:40, marginTop:10,
                        justifyContent:'center', 
                        borderRadius:20}}>
                    <Image
                    style={{tintColor:'#6A0DAD', 
                    width:20, 
                    height:20, 
                    resizeMode:'contain',
                    alignSelf:'center'}}
                    source={{uri:'https://www.iconsdb.com/icons/preview/black/edit-3-xxl.png'}}/>
                    </View>
        </TouchableOpacity>
        </View>
        
        {!isEditAbout?
        <View style={{ paddingHorizontal:30}}>
          <View style={styles.aboutBox}>
          <Text style={styles.aboutText}>
            {about}
          </Text>
          </View>
        </View>

          :
          <View style={{ paddingHorizontal:30}}>
          <View style={styles.aboutBox}>
          <TextInput
          style={{fontSize:16, color:'white', padding:10, textAlignVertical:'top'}}
          placeholder='Tell the community a bit about yourself'
          placeholderTextColor={'grey'}
          value={about}
          onChangeText={onAboutTyped}
          maxLength={100}
          multiline={true}
          />
          </View>
        </View>
        }

        <View style={{flexDirection:'row', alignSelf:'center', marginHorizontal:20}}>
        
        <View style={{paddingRight:20}}>
        <Text style={styles.followersText}>
          Followers
        </Text>
        
        <Text style={styles.followersNumber}>
          {followDisplayCount}
        </Text>
        </View>
        
        <View style={{paddingLeft:20}}>
        <Text style={styles.booksPublishedText}>
          Books Published
        </Text>

        <Text style={styles.publishedNumber}>
          {bookDisplayCount}
        </Text>
        </View>

        </View>
    

    
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
        marginTop:10,
        width:250,
        height:60,
        resizeMode:'cover',
        alignSelf:'center'
      },
      profilePhoto:{
        width:140,
        height:140,
        resizeMode:'cover',
        alignSelf:'center'
      },
      usernameText:{
        fontFamily:'BetweenDays', 
        fontSize:26, 
        color:'white',
        textShadowColor:'silver',
        textShadowRadius:10,
        padding:20,
        marginTop:10,
        textAlign:'center'
      },
      aboutSectionText:{
        fontFamily:'BetweenDays', 
        fontSize:22, 
        color:'white',
        textShadowColor:'silver',
        textShadowRadius:10,
        paddingLeft:35,
        paddingVertical:10,
        marginTop:20,
      },
      aboutBox:{
        borderColor:'#6A0DAD',
        borderWidth:2, 
        borderRadius:10,
        flexWrap:'wrap',
        alignItems:'center',
      },
      aboutText:{
        fontFamily:'Contane',
        color:'white',
        fontSize:16,
        textAlignVertical:'center',
        padding:15
      },
      booksPublishedText:{
        fontFamily:'BetweenDays', 
        fontSize:22, 
        color:'white',
        textShadowColor:'silver',
        textShadowRadius:10,
        textAlign:'center',
        paddingTop:50,
        paddingBottom:20
      },
      publishedNumber:{
        fontFamily:'BetweenDays', 
        fontSize:50, 
        color:'white',
        textShadowColor:'silver',
        textShadowRadius:10,
        textAlign:'center'
      },
      followersText:{
        fontFamily:'BetweenDays', 
        fontSize:22, 
        color:'white',
        textShadowColor:'silver',
        textShadowRadius:10,
        textAlign:'center',
        paddingTop:50,
        paddingBottom:20
      },
      followersNumber:{
        fontFamily:'BetweenDays', 
        fontSize:50, 
        color:'white',
        textShadowColor:'silver',
        textShadowRadius:10,
        textAlign:'center'
      }
    });