const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000; // Use port from environment or default to 3000

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set up in-memory storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to convert buffer to generative part
function bufferToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

// Endpoint to handle image upload and generate alt text
app.post('/generate-alt-text', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  // Check if API key is present
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return res.status(500).json({ error: 'Server configuration error: API key not found.' });
  }

  const buffer = req.file.buffer;
  const mimeType = req.file.mimetype;

  try {
    const prompt = 'Generate a short, descriptive alt text for this image.';
    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    res.json({ altText: text });
  } catch (error) {
    // Log the actual error from Google's API on the server
    console.error('Error calling Gemini API:', error); 
    
    // Send a more descriptive error to the client
    res.status(500).json({ error: 'Failed to generate alt text from API.', details: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
