import axios from "axios";
import { geminiKey } from "./GeminiApiKey";




 export const storyEmbedding = async(storyContent, storyTitle)=> {
    


    const request = {
        model: 'models/text-embedding-004',
        content: {
          parts: [{
            text: storyContent
          }]
        },
        task_type: "RETRIEVAL_DOCUMENT",
        title: storyTitle
      };



    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`;
    
    
    try {
        const response = await axios.post(endpoint, request);

        const embedding = response.data.embedding.values;

        return embedding;
            
        

    } catch (error) {
        console.error('Error generating embeddings:', error);
    }
    
}

