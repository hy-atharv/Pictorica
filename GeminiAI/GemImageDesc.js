import axios from "axios";
import * as FileSystem from 'expo-file-system'
import { geminiKey } from "./GeminiApiKey";

export const geminiImgDesc = async (imageUri, genre) => {
    try {
      
      const imageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem?.EncodingType.Base64
      })
      
      const prompt = "What's this picture and what type of story can be written on it based on the genre " + genre+"Give 3 story ideas in 100 words and AVOID FORMATTING.\nGIVE IN SIMPLE STRING";
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