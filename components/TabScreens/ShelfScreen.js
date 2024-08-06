import { View, Text,Image, RefreshControl, TouchableOpacity, FlatList, SafeAreaView,ScrollView, StyleSheet, Platform, StatusBar, ImageBackground, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, useEffect, useCallback } from 'react'
import Animated, { FadeInUp } from 'react-native-reanimated';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app, auth } from '../../Firebase/firebaseConfig';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];



var date = new Date().getDate()
var month = monthNames[new Date().getMonth()]
var year = new Date().getFullYear()


const db = getFirestore(app)

export default function ShelfScreen({navigation}) {
  
  const user = auth.currentUser.displayName

  const [refreshing, setRefreshing] = useState(false); 
  const [savedBooks, setSavedBooks] = useState([]);
  const [yourBooks, setYourBooks] = useState([]);


  const fetchData = async () => {
    try {
      const storiesCollection = collection(db, user);
      const snapshot = await getDocs(storiesCollection);
      const booksData = {
        savedBooks: [],
        yourBooks: []
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        for (const title in data) {
          if (data.hasOwnProperty(title)) {
            const storyData = data[title];
            const book = {
              title: title,
              category: doc.id,
              genre: storyData.genre || '',
              author: storyData.author || '',
              imageURL: storyData.imageURL || '', 
              likes: storyData.likes || 0,
              story: storyData.story || '',
              time: storyData.time || '',
              timestamp: storyData.timestamp || ''
            };

            if (doc.id === 'saved') {
              booksData.savedBooks.push(book);
            }
            else if(doc.id === 'your works') {
              booksData.yourBooks.push(book);
            }
  
          }
        }
      });

      booksData.savedBooks.sort((a, b) => {
        
        const aTimestamp = a.timestamp.toDate();
        const bTimestamp = b.timestamp.toDate();
      

        return bTimestamp - aTimestamp; 
      });

      booksData.yourBooks.sort((a, b) => {

        const aTimestamp = a.timestamp.toDate();
        const bTimestamp = b.timestamp.toDate();
      

        return bTimestamp - aTimestamp; 
      });
      
      setSavedBooks(booksData.savedBooks)
      setYourBooks(booksData.yourBooks)

    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);


  useEffect(() => {
    fetchData();
  }, []);


  const Books = ({book}) => {
    return(
  
      <TouchableOpacity onPress={() => handleBook(book)}>
      <View style={{padding:10,marginLeft:5}}>
        <Image
        source={{uri:book.imageURL}}
        style={styles.bookCover}
        />
        <View style={{width:120,padding:5}}>
        <Text numberOfLines={1}
        style={styles.bookName}>
          {book.title}
        </Text>
        </View>
        
      </View>
      </TouchableOpacity>
    )
  }


  const handleBook = (book) => {
    navigation.navigate('LibStoryScreen',{
      Story: book.story,
      Author: book.author,
      Genre: book.genre,
      ReadTime: book.time,
      Title: book.title,
      ImageUri: book.imageURL,
    })
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
       <Animated.View entering={FadeInUp.duration(1000)}>
       <ImageBackground source={require('../../assets/arts/shelfArt.jpeg')}
       resizeMode={'cover'}
       imageStyle={{opacity:0.3}}
       style={{ width:Dimensions.get('window').width,
       height: Dimensions.get('window').height - 140,}}>

      <ScrollView
              refreshControl={
                <RefreshControl 
                refreshing={refreshing} onRefresh={onRefresh} 
                colors={['#6A0DAD']} 
                progressBackgroundColor={'black'} />
              } >
        
        <Text style={styles.categoryText}>
          Read Later
        </Text>
        {(savedBooks.length===0)?
        <Text style={{fontFamily:'Contane', textAlign:'center', fontSize:20, color:'white'}}>
          Nothing for now...
        </Text>
        :
        <FlatList
        data={savedBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />
        }

        
        

        <Text style={styles.categoryText}>
          Your Works
        </Text>
        {(yourBooks.length===0)?
        <Text style={{fontFamily:'Contane', textAlign:'center', fontSize:20, color:'white'}}>
          Create your first one now!
        </Text>
        :
        <FlatList
        data={yourBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />
        }
        

      </ScrollView>

       </ImageBackground>
       </Animated.View>
        
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
  categoryText:{
    fontFamily:'BetweenDays', 
    fontSize:28, 
    color:'white',
    textShadowColor:'silver',
    textShadowRadius:10,
    padding:15
  },
  bookCover:{
    width:120,
    height:170,
    resizeMode:'cover',
    borderRadius:10,
  },
  bookName:{
    fontFamily:'Contane',
    fontSize:16,
    color:'white'
  }

  
})



