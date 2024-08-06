import { View, Text, Alert } from 'react-native'
import React from 'react'
import { getFirestore , collection, getDocs} from 'firebase/firestore'
import { app } from '../../../../Firebase/firebaseConfig'


const db = getFirestore(app)


export const semanticSearch = async(searchEmbeds)=> {
  
    try {
        const embedsCollection = collection(db, 'storyEmbeds');
        const snapshot = await getDocs(embedsCollection);
    
        const storiesEmbeddings = [];
    
        snapshot.forEach(doc => {
            const data = doc.data();
            const storyTitle = doc.id; //
            const storyEmbeddings = data.storyEmbeddings;
            if (storyEmbeddings) {
              storiesEmbeddings.push({
                storyTitle: storyTitle,
                storyEmbedding: storyEmbeddings
              });
            }
          });

        console.log(storiesEmbeddings);
        const similarityScores = storiesEmbeddings.map(story => ({
            storyTitle: story.storyTitle,
            similarity: cosineSimilarity(story.storyEmbedding, searchEmbeds)
          }));
      

        similarityScores.sort((a, b) => b.similarity - a.similarity);
        
        console.log(similarityScores);
      

        const top5Stories = similarityScores.slice(0, 5).map(story => story.storyTitle);
      
        return top5Stories;



    } catch(error) {
        console.error(error);
        Alert.alert("Something went wrong...")
    }
}


const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }




export const fetchSearchData = async (relevantStories) => {
  try {
    const storiesCollection = collection(db, 'stories');
    const snapshot = await getDocs(storiesCollection);
    const searchedBooks = [];


    const relevantStoriesMap = relevantStories.reduce((map, title) => {
      map[title] = true;
      return map;
    }, {});


    const tempStories = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      for (const title in data) {
        if (data.hasOwnProperty(title) && relevantStoriesMap[title]) {
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
          tempStories.push(book);
        }
      }
    });


    relevantStories.forEach(title => {
      const story = tempStories.find(story => story.title === title);
      if (story) {
        searchedBooks.push(story);
      }
    });

    return searchedBooks;

  } catch (error) {
    console.error('Error fetching searched books:', error);
  }
};
