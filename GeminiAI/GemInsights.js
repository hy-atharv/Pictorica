import axios from "axios";
import { geminiKey } from "./GeminiApiKey";

export const geminiInsights = async (topStories, userBestStories) => {
    try {
      
        const formatStories = (stories) => {
            return stories.map(story => {
                return `Title: ${story.title}\n` +
                       `Author: ${story.author}\n` +
                       `Likes: ${story.likes}\n` +
                       `Impressions: ${story.impressions}`;
            }).join('\n\n');
        };

        const formattedTopStories = formatStories(topStories);
        const formattedUserBestStories = formatStories(userBestStories);
      
      const prompt = "Compare the Top Stories and my Stories based on likes and impressions values in the object:\n\n"
                     + `Top Stories:\n${formattedTopStories}\n\n`
                     + `My Stories:\n${formattedUserBestStories}\n\n`
                     + `Now based on likes and impressions values, generate insights in 200 words, as described below:\n`
                     + `If Top Stories has one or more story, that has more likes and impressions, generate insights on what kind of stories people are liking and how can I improvise my stories to rank better.\n`
                     + `If User Best Stories has one or more story, that has more likes and impressions, generate insights on how my stories are performing good and what kind of my stories people like the most.`
                     + "\n\nAVOID MARKDOWN TEXT."



      

      
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
           contents:[
            {
                parts:[

                    { text: prompt }
                    
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