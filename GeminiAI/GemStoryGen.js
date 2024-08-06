import axios from "axios";
import * as FileSystem from 'expo-file-system'
import { geminiKey } from "./GeminiApiKey";

export const geminiStoryGen = async (genre, imageUri, author, mainChar, storyDesc, title) => {
    try {
      
      const imageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem?.EncodingType.Base64
      })
      
      const prompt = "Write a story in more than 1000 words based on this image and following parameters\n\n"
                     + `Genre: ${genre}\n`
                     + `Writing style inspired by Author: ${author}\n`
                     + `Main Character: ${mainChar}\n`
                     + `Brief Description of Story: ${storyDesc}\n`
                     + `Title of the Story: ${title}`
                     + "\n\nAVOID MARKDOWN TEXT. GIVE THE STORY IN PLAIN TEXT"



      const lastDotIndex = imageUri.lastIndexOf('.');
      const extension = imageUri.substring(lastDotIndex + 1).toLowerCase();
      console.log(extension);

      
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
           contents:[
            {
                parts:[

                    { text: prompt },
                    {
                        inline_data: {
                          mime_type: `image/${extension}` ,
                          data: imageData
                        }
                    }
                ]
            }
           ],
           "safetySettings": [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            },
            {
              "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              "threshold": "BLOCK_NONE"
            },
            {
              "category": "HARM_CATEGORY_HARASSMENT",
              "threshold": "BLOCK_NONE"
            },
            {
              "category": "HARM_CATEGORY_HATE_SPEECH",
              "threshold": "BLOCK_NONE"
            }
        ]
        }
      );
  
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(text)
      return text;
    } catch (error) {
      throw error;
    }
  }



  export const geminiStoryTitle = async (story) => {
    try {
      

      const prompt = `For the given story, give a suitable and relevant title\n`
                    +`Story:\n\n${story}`
                    +`\n\nGive output in the following JSON Schema\n`
                    +`{"Title": {"type":"string"}, "Reading_Time":{"type":"string"}}`

      
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCkdEp9g13n294WIvxjqXh5W9n_KUCmRqg`,
        {
           contents:[
            {
                parts:[

                    { text: prompt }
                ]
            }
           ],
           "generationConfig": {
            "response_mime_type":"application/json",
           }
        }
      );
  
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(text)
      return text;
    } catch (error) {
      throw error;
    }
  }