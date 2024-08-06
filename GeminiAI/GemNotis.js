import axios from "axios";
import { geminiKey } from "./GeminiApiKey";



export const storyNotif = async(story) => {
  


   const instruction = `Your job is to craft a creative push notification in 3 lines to attract users to given story`

    try {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
            system_instruction: {
                parts: [{ text: instruction }]
              },

            contents: [
                {
                    parts:[
    
                        { text: `Story:\n${story}` }
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
      console.log(`Notification: ${text}`)
      return text;
    } catch (error) {
      throw error;
    }
  }



  
    
