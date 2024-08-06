import { View, Text, TextInput, RefreshControl, ActivityIndicator, SafeAreaView, Image, StyleSheet,ScrollView, Platform, StatusBar, Dimensions, ImageBackground, TouchableOpacity, FlatList, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState,useEffect, useCallback } from 'react'
import Animated,  { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { collection, doc, getDocs, getFirestore, updateDoc, increment } from 'firebase/firestore';
import { app } from '../../Firebase/firebaseConfig';
import { searchEmbedding } from '../../GeminiAI/GemSearchEmbeds';
import { fetchSearchData, semanticSearch } from './Routes/LibraryRoute/SearchStory';



const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var date = new Date().getDate()
var month = monthNames[new Date().getMonth()]
var year = new Date().getFullYear()




const db = getFirestore(app)


export default function LibraryScreen({navigation}) {

  const [findStory, onStoryTyped] = useState('')
  const [refreshing, setRefreshing] = useState(false);



  const [fantasyBooks, setFantasyBooks] = useState([]);
  const [horrorBooks, setHorrorBooks] = useState([]);
  const [adventureBooks, setAdventureBooks] = useState([]);
  const [dramaBooks, setDramaBooks] = useState([]);
  const [crimeBooks, setCrimeBooks] = useState([]);
  const [mysteryBooks, setMysteryBooks] = useState([]);
  const [mythologyBooks, setMythologyBooks] = useState([]);
  const [scifiBooks, setSciFiBooks] = useState([]);

  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);

  const [libLoading, setLibLoading] = useState(false);
  
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchPage, setSearchPage] = useState(false);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);

  const [resultName, setResultName] = useState('');


  const fetchData = async () => {
   
   setLibLoading(true);
    
    try {
      
      const storiesCollection = collection(db, 'stories');
      const snapshot = await getDocs(storiesCollection);
      const booksData = {
        fantasyBooks: [],
        horrorBooks: [],
        adventureBooks: [],
        dramaBooks: [],
        crimeBooks: [],
        mysteryBooks: [],
        mythologyBooks: [],
        scifiBooks: [],
        newBooks: [],
        popularBooks: [],
        allBooks: []
      };

      snapshot.forEach(doc => {
        const data = doc.data();
        for (const title in data) {
          if (data.hasOwnProperty(title)) {
            const storyData = data[title];
            const book = {
              title: title,
              genre: doc.id,
              author: storyData.author || '',
              imageURL: storyData.imageURL || '',
              likes: storyData.likes || 0,
              story: storyData.story || '',
              time: storyData.time || '',
              timestamp: storyData.timestamp || ''
            };

            if (doc.id === 'fantasy') {
              booksData.fantasyBooks.push(book);
            }
            else if(doc.id === 'horror') {
              booksData.horrorBooks.push(book);
            }
            else if(doc.id === 'adventure') {
              booksData.adventureBooks.push(book);
            }
            else if(doc.id === 'drama') {
              booksData.dramaBooks.push(book);
            }
            else if(doc.id === 'crime') {
              booksData.crimeBooks.push(book);
            }
            else if(doc.id === 'mystery') {
              booksData.mysteryBooks.push(book);
            }
            else if(doc.id === 'mythology') {
              booksData.mythologyBooks.push(book);
            }
            else if(doc.id === 'sci-fi') {
              booksData.scifiBooks.push(book);
            }

            booksData.newBooks.push(book);
            booksData.popularBooks.push(book);
            booksData.allBooks.push(book);
          }
        }
      });

      booksData.newBooks.sort((a, b) => {
        // Convert Firestore timestamps to Date objects
        const aTimestamp = a.timestamp.toDate();
        const bTimestamp = b.timestamp.toDate();
      
        // Compare the Date objects
        return bTimestamp - aTimestamp; 
      });
      booksData.popularBooks.sort((a, b) => b.likes - a.likes);

      setFantasyBooks(booksData.fantasyBooks);
      setHorrorBooks(booksData.horrorBooks);
      setAdventureBooks(booksData.adventureBooks);
      setDramaBooks(booksData.dramaBooks);
      setCrimeBooks(booksData.crimeBooks);
      setMysteryBooks(booksData.mysteryBooks);
      setMythologyBooks(booksData.mythologyBooks);
      setSciFiBooks(booksData.scifiBooks);

      setNewBooks(booksData.newBooks.slice(0, 10));
      setPopularBooks(booksData.popularBooks.slice(0, 10));

      setAllBooks(booksData.allBooks);

      setLibLoading(false);

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




  const handleSearch = async() => {
     
     setSearchLoading(true);

     const searchInput = findStory;
     onStoryTyped('');

     const matchingAuthor = allBooks
     .filter(book => book.author.toLowerCase() === findStory.toLowerCase())
     .map(book => book.title)

    if(matchingAuthor.length <= 0)
    {
      console.log('No authors found');
      setResultName('Relevant Books')

     try{
     const searchEmbeds = await searchEmbedding(searchInput);
     console.log(searchEmbeds.length)

     const relevantTitles = await semanticSearch(searchEmbeds);

     console.log(relevantTitles)

     const relevantBooks = await fetchSearchData(relevantTitles);

     setSearchedBooks(relevantBooks);

     setSearchPage(true);

     setSearchLoading(false);
     

     } catch(error) {
      console.error(error)
      Alert.alert("Something went wrong...")
     }
    }

    else {
      try {

        let relevantBooks = await fetchSearchData(matchingAuthor);

        
        const authorname = relevantBooks[0].author;

        setSearchedBooks(relevantBooks);

        setSearchPage(true);

        setSearchLoading(false);
        
        setResultName(`Works by ${authorname}`);
      }
      catch(error) {
      console.error(error)
      Alert.alert("Something went wrong...")
      }
    }
  }


  const handleBackButton = () => {
    setSearchedBooks([]);
    setResultName('')
    setSearchPage(false);
  }


  


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


  const handleBook = async(book) => {
    

    navigation.navigate('LibStoryScreen',{
      Story: book.story,
      Author: book.author,
      Genre: book.genre,
      ReadTime: book.time,
      Title: book.title,
      ImageUri: book.imageURL,
    })

    try{
      await updateDoc(doc(db,"stories", book.genre),{
        [`${book.title}.impressions`]: increment(1),
      });
    } catch(error) {
      console.log(error)
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
      <Animated.View entering={FadeInDown.duration(1000)}>
      <ImageBackground
       source={require('../../assets/arts/libraryArt.png')}
       resizeMode={'cover'}
       imageStyle={{opacity:0.3}}
       style={{ width:Dimensions.get('window').width,
       height: Dimensions.get('window').height - 140,}}>
       
       <View style={{flexDirection:'row', backgroundColor:'#070320', margin:10,borderRadius:50}}>
       <TextInput
        style={{textAlignVertical:'top',backgroundColor:'#070320',fontSize:16, color:"white", paddingTop:5,marginHorizontal:15,marginVertical:10,width:260}}
        placeholder='Seach Library'
        placeholderTextColor={'grey'}
        value={findStory}
        onChangeText={onStoryTyped}
        maxLength={200}
        multiline={true}
        />

        <TouchableOpacity onPress={handleSearch} style={{marginTop:10}}>
        <Image
        source={require('../../assets/searchIcon.png')}
        style={{resizeMode:'contain',width:30,height:30,}}/>
        </TouchableOpacity>


        </View>
       
       {!libLoading?
       <View style={{height:495}}>
       {!isSearchPage?
        !searchLoading?
        <ScrollView
              refreshControl={
                <RefreshControl 
                refreshing={refreshing} onRefresh={onRefresh} 
                colors={['#6A0DAD']} 
                progressBackgroundColor={'black'} />
              } >
        
        <Text style={styles.categoryText}>
          New Releases
        </Text>
        <FlatList
        data={newBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />

        <Text style={styles.categoryText}>
          Popular
        </Text>
        <FlatList
        data={popularBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />

        <Text style={styles.categoryText}>
          Fantasy
        </Text>
        <FlatList
        data={fantasyBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />

        <Text style={styles.categoryText}>
          Horror
        </Text>
        <FlatList
        data={horrorBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />

        <Text style={styles.categoryText}>
          Adventure
        </Text>
        <FlatList
        data={adventureBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />

        <Text style={styles.categoryText}>
          Drama
        </Text>
        <FlatList
        data={dramaBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />

        <Text style={styles.categoryText}>
          Crime
        </Text>
        <FlatList
        data={crimeBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />

        <Text style={styles.categoryText}>
          Mystery
        </Text>
        <FlatList
        data={mysteryBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />

        <Text style={styles.categoryText}>
          Mythology
        </Text>
        <FlatList
        data={mythologyBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />

        <Text style={styles.categoryText}>
          Sci-Fi
        </Text>
        <FlatList
        data={scifiBooks}
        horizontal={true}
        renderItem={({item}) => <Books book={item}/>}
        />
        <View style={{height:50}}>

        </View>
        </ScrollView>

         :

         <View
         style={{position:'absolute', 
         height:Dimensions.get('window').height, 
         width:Dimensions.get('window').width,  
         justifyContent:'top',
         backgroundColor:'black', 
         opacity:0.9}}>
          <ActivityIndicator
          style={{marginTop:260}}
          size='large'
          color='#6A0DAD'/>
         <Text style={{fontFamily:'Contane', color:'white', textAlign:'center',fontSize:20}}>
          Searching...
         </Text>
         </View>
        

        :

        <ScrollView>
         <Text style={styles.categoryText}>
           {resultName}
         </Text> 
          <FlatList
          data={searchedBooks}
          horizontal={true}
          renderItem={({item}) => <Books book={item}/>}
          />

          <TouchableOpacity onPress={handleBackButton}>
            <Image
            style={{marginTop:50,width:60, height:60, alignSelf:'center', resizeMode:'contain'}}
            source={require('../../assets/backButton.png')}/>
          </TouchableOpacity>

        </ScrollView>

        }
       </View>
       

       :

       <View
         style={{position:'absolute', 
         height:Dimensions.get('window').height, 
         width:Dimensions.get('window').width,  
         justifyContent:'top',
         backgroundColor:'black', 
         opacity:0.9}}>
          <ActivityIndicator
          style={{marginTop:260}}
          size='large'
          color='#6A0DAD'/>
         <Text style={{fontFamily:'Contane', color:'white', textAlign:'center',fontSize:20}}>
          Loading Library...
         </Text>
         </View>
        }


      


       
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