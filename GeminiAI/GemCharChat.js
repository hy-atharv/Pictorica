import axios from "axios";
import { geminiKey } from "./GeminiApiKey";



export const charChat = async(story, prevChat) => {
  


   const instruction = `You are the main character of this story. Chat like them\nStory:\n${story}`

    try {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
            system_instruction: {
                parts: [{ text: instruction }]
              },

            contents: prevChat,

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
      console.log("Character: "+text)
      return text;
    } catch (error) {
      throw error;
    }
  }



  
    
