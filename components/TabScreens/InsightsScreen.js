import { View, Text, SafeAreaView, RefreshControl, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, StatusBar, Dimensions, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import Animated, { FadeInUp} from 'react-native-reanimated';
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app, auth } from '../../Firebase/firebaseConfig';
import { geminiInsights } from '../../GeminiAI/GemInsights';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var date = new Date().getDate()
var month = monthNames[new Date().getMonth()]
var year = new Date().getFullYear()

const db = getFirestore(app)

export default function InsightsScreen({navigation}) {
  
  const user = auth.currentUser.displayName

  const [refreshing, setRefreshing] = useState(false); 
  const [yourPublishedBooks, setYourPublishedBooks] = useState([]);


  const [worksInsights, setWorksInsights] = useState('');

  const [loading, setLoading] = useState(false);


  const fetchData = async () => {

    setLoading(true);
    try {
      const storiesCollection = collection(db, "stories");
      const snapshot = await getDocs(storiesCollection);
      const booksData = {
        yourBooks: [],
        otherBooks: []
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
              impressions: storyData.impressions || 0,
              story: storyData.story || '',
              time: storyData.time || '',
              timestamp: storyData.timestamp || ''
            };

            if(storyData.author === user) {
              booksData.yourBooks.push(book);
            }
            else{
              booksData.otherBooks.push(book);
            }
  
          }
        }
      });


      booksData.yourBooks.sort((a, b) => { return b.likes - a.likes});
      setYourPublishedBooks(booksData.yourBooks)

      booksData.otherBooks.sort((a, b) => { return b.likes - a.likes});
      
      if(booksData.yourBooks.length > 0) {

      const insights = await geminiInsights(booksData.otherBooks, booksData.yourBooks);

      setWorksInsights(insights);

      } else {
        setWorksInsights('Create your first bestseller now!')
      }

      setLoading(false);

      

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

    const GeminiInsights = async() => {
      

    }

    GeminiInsights();
  }, []);


  const Books = ({book}) => {
    return(
  
      <TouchableOpacity onPress={() => handleBook(book)}>
      <View style={{padding:10,marginLeft:10, flexDirection:'row'}}>
        <View>
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
        
        <View style={{paddingLeft:20}}>
        <Text style={styles.statHeadText}>
          Impressions
        </Text>

        <Text style={styles.statNumber}>
          {book.impressions}
        </Text>
        </View>

        <View style={{paddingLeft:20}}>
        <Text style={styles.statHeadText}>
          Likes
        </Text>

        <Text style={styles.statNumber}>
          {book.likes}
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
       <ImageBackground source={require('../../assets/arts/insightsArt.jpeg')}
       resizeMode={'cover'}
       imageStyle={{opacity:0.3}}
       style={{ width:Dimensions.get('window').width,
       height: Dimensions.get('window').height - 140,}}>
        
        <View style={{height:210, marginTop:20}}>
        <ScrollView >
        <View style={{
          flexDirection:'row', padding:10, margin:10, backgroundColor:'#070320', borderRadius:15,
          flexWrap:'wrap'
         }}>
          <Image
          style={{width:30,height:30,resizeMode:'cover',padding:10}}
          source={require('../../assets/BottomTabIcons/createIcon.png')}/>
           {loading? 
            <Text style={{
             fontFamily:'Contane', color:'grey', padding:5, fontSize:18, textAlign:'center', marginLeft:20
             }}>
             Analyzing...
            </Text>

            :

            <Text style={{
             fontFamily:'Contane', color:'white', padding:5, fontSize:16
             }}>
             {worksInsights}
            </Text>
           }

        </View>
        </ScrollView>
        </View>


        <Text style={styles.categoryText}>
          Published Works Analytics
        </Text>
        <FlatList
        data={yourPublishedBooks}
        renderItem={({item}) => <Books book={item}/>}
        refreshControl={
          <RefreshControl 
          refreshing={refreshing} onRefresh={onRefresh} 
          colors={['#6A0DAD']} 
          progressBackgroundColor={'black'} />
        }
        />


       
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
    fontSize:24, 
    color:'white',
    textShadowColor:'silver',
    textShadowRadius:10,
    padding:15,
    marginTop:20,
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
  },
  statHeadText:{
    fontFamily:'BetweenDays', 
    fontSize:19, 
    color:'white',
    textShadowColor:'silver',
    textShadowRadius:10,
    textAlign:'center',
    paddingTop:50,
    paddingBottom:20
  },
  statNumber:{
    fontFamily:'BetweenDays', 
    fontSize:50, 
    color:'white',
    textShadowColor:'silver',
    textShadowRadius:10,
    textAlign:'center'
  },

  
})