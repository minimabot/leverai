import {NextApiRequest, NextApiResponse} from 'next';
import {Configuration, OpenAIApi} from 'openai';

const config = new Configuration({apiKey: process.env.OPEN_AI_API_KEY});
const openAI = new OpenAIApi(config);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({message: 'Only POST requests allowed'});
  }
  try {
		console.log(req.body.prompt)
    const {
      data: {choices},
    } = await openAI.createCompletion({
      model: 'text-davinci-003',
      prompt: req.body.prompt,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    res.status(200).send({text: choices[0]?.text || 'No response from GPT-3'});
  } catch (error) {
    console.log(error);
    res.status(500).send({error});
  }
};

export default handler;
