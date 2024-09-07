import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = process.env.REACT_APP_ENDPOINT
const LOCATION = process.env.REACT_APP_LOCATION
const API_KEY = process.env.REACT_APP_API_KEY

export const azureTranslationApi = async (transcript, sourceLanguage, targetLanguage) => {
    try {
        // console.log(1)
        const response = await axios.post(
            BASE_URL + '/translate',
            [{
                'text': transcript
            }],
            {
                headers: {
                'Ocp-Apim-Subscription-Key': API_KEY,
                'Ocp-Apim-Subscription-Region': LOCATION,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
                },
                params: {
                'api-version': '3.0',
                'from': sourceLanguage,
                'to': targetLanguage
                },
                responseType: 'json'
            })
    
        return response.data[0].translations[0].text;
    } catch (err) {
        console.log(err)
        throw err;
    }
} 