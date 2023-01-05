import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'


dotenv.config();

const configuration = new Configuration ({
    apiKey: process.env.OPENAI_API_KEY,
});

//Instance of the program is openai + configuration
const openai = new OpenAIApi(configuration);


//Initialice the app
const app = express();
app.use(cors()); //Allow us to make the cross requests
app.use(express.json()); //Send json from frontend to backend

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex'
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion ({
            model: "text-davinci-003",  //AI version
            prompt: `${prompt}`,        //We send the prompt that the user writes in our app
            temperature: 0,             //The risk AI takes when answering correct from 0 to 1 (0 low risk, 1 high risk)
             max_tokens: 3000,          //How many tokens can it take to answer (64 is small, 3000 is really long)
            top_p: 1,                   //
            frequency_penalty: 0.5,     //Likely to repeat the same answer (when asking similar question again)
            presence_penalty: 0,        //
            //stop: ["\"\"\""],         //We dont need an stop in our case
        })

        //We send it back to the frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));