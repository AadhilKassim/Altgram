const express = require('express');
const multer = require('multer');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up in-memory storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- NEW DEBUG ENDPOINT ---
app.get('/list-models', async (req, res) => {
  try {
    console.log('Fetching available models...');
    const models = await genAI.listModels();
    let modelList = [];
    for await (const m of models) {
        // Log each model found to the server logs
        console.log("Found model:", m.name, "methods:", m.supportedGenerationMethods);
        modelList.push({ name: m.name, methods: m.supportedGenerationMethods });
    }
    // Return the list as a JSON response
    res.json(modelList);
  } catch(error) {
    console.error('Error listing models:', error);
    res.status(500).json({ error: 'Failed to list models', details: error.message });
  }
});

// Endpoint to handle image upload and generate alt text
app.post('/generate-alt-text', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return res.status(500).json({ error: 'Server configuration error: API key not found.' });
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' }); // Still using this for now

  const buffer = req.file.buffer;
  const mimeType = req.file.mimetype;

  try {
    const prompt = 'Generate a short, descriptive alt text for this image.';
    const imagePart = { inlineData: { data: buffer.toString('base64'), mimeType } };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    res.json({ altText: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error); 
    res.status(500).json({ error: 'Failed to generate alt text from API.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
