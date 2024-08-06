import { View, Text,Image, TouchableOpacity, SafeAreaView, StyleSheet, Platform, StatusBar, ImageBackground, Dimensions, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect} from 'react'
import { app, auth } from '../../../../Firebase/firebaseConfig'
import {  doc, getFirestore, collection, setDoc, query, where, getDoc,onSnapshot, updateDoc, increment } from 'firebase/firestore';



const db = getFirestore(app);




export default function AuthorProfile({route}) {

const {username} = route.params;  
const currentUser = auth.currentUser.displayName;

    const [image, setImage] = useState('https://preview.redd.it/default-pfp-v0-1to4yvt3i88c1.png?auto=webp&s=ceae4a63a8aba081b217716078db1a9f8101a3b3');
    
    const [about, setAboutMe] = useState('');

    const [bookCount, setBookCount] = useState(0);
    const [followCount, setFollowCount] = useState(0);

    const [bookDisplayCount, setBookDisplayCount] = useState(0);
    const [followDisplayCount, setFollowDisplayCount] = useState(0);

    const [followStatus, setFollowStatus] = useState(false);

    const [userId, setUserId] = useState('');


    useEffect(() => {
        if (!username || !currentUser) return; // Check if required variables are available
      
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('username', '==', username));
      
        const unsubscribeData = onSnapshot(
          q,
          (querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.exists()) {
                const data = doc.data();
                const pfpURL = data['pfpURL'];
                const aboutUser = data['aboutMe'];
                const followers = data['followers'];
                setFollowCount(followers);
                setUserId(doc.id);
                
                setImage(pfpURL || 'https://preview.redd.it/default-pfp-v0-1to4yvt3i88c1.png?auto=webp&s=ceae4a63a8aba081b217716078db1a9f8101a3b3');
                setAboutMe(aboutUser || '');
              } else {
                console.log("Document does not exist");
              }
            });
          },
          (error) => {
            console.error("Error getting document:", error);
          }
        );
      
        const docRefFollowStatus = doc(db, 'userFollows', currentUser);
        const unsubscribeFollowStatus = onSnapshot(
          docRefFollowStatus,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              try {
                const data = docSnapshot.data();
                if (data[username]) {
                  const following = data[username].following;
                  console.log(following);
                  setFollowStatus(following);
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
          }
        );
      
        const countBooks = async () => {
          try {
            const userDocRef = doc(db, username, 'your works');
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
      
        return () => {
          unsubscribeData();
          unsubscribeFollowStatus();
        };
      }, [username, currentUser]);
      



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
      


  const handleFollow = async() => {
    setFollowStatus(!followStatus);

    if(!followStatus) {
     try{
        await updateDoc(doc(db,"users",userId),
        {
            followers:increment(1),
        })

        await setDoc(doc(db, 'userFollows', currentUser), {
            [`${username}`]: {
              following:true,
            },
          }, {merge:true});

     } catch(error) {
        console.log(error);
        Alert.alert('Something went wrong...')
     }

    }

    else if(followStatus) {
        try{
            await updateDoc(doc(db,"users",userId),
            {
                followers:increment(-1),
            })

            await updateDoc(doc(db, 'userFollows', currentUser), {
                [`${username}.following`]: false,
              });

         } catch(error) {
            console.log(error);
            Alert.alert('Something went wrong...')
         }
    }
  }


    return (
        <LinearGradient colors={['#030717','#6A0DAD']} style={styles.container}
        start={[1,0]} end={[1,4]}>
          <SafeAreaView>
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
            source={{uri:image}}/>     
          </View>


        <Text style={styles.usernameText}>
          {username}
        </Text>
        
        <TouchableOpacity onPress={handleFollow}>
        <View style={{ alignItems:'center', backgroundColor:followStatus?'#6A0DAD':'transparent'}}>
         
          <View style={styles.followBox}>
          <Text style={styles.followText}>
            {followStatus?'Following':'Follow'}
          </Text>
          </View>
         
        </View>
        </TouchableOpacity>

        <View style={{flexDirection:'row'}}>
        <Text style={styles.aboutSectionText}>
          About
        </Text>
        </View>
        

        <View style={{ paddingHorizontal:30}}>
          <View style={styles.aboutBox}>
          <Text style={styles.aboutText}>
            {about}
          </Text>
          </View>
        </View>
        
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
        alignSelf:'center',
        marginTop:-20
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
      followBox:{
        borderColor:'#6A0DAD',
        borderWidth:2, 
        borderRadius:20,
        alignItems:'center'
      },
      followText:{
        fontFamily:'Contane',
        color:'white',
        fontSize:18,
        textAlign:'center',
        paddingHorizontal:10,
        paddingVertical:5
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
        textAlign:'center',
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