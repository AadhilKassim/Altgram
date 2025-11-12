# Altagram - AI-Powered Image Alt Text Generator

Altagram is a web application that uses the Google Gemini API to generate descriptive alt text for images. Users can upload an image through a simple, chat-like interface and receive an AI-generated alt text.

## Features

-   **Simple UI:** A clean and modern user interface with a gray and blue color scheme, inspired by Google's Gemini.
-   **Image Upload:** Easy image selection and upload.
-   **AI-Powered Alt Text:** Leverages the Google Gemini API to generate accurate and context-aware alt text.
-   **No Login Required:** Accessible to everyone without needing an account.
-   **Privacy-Focused:** Images are only stored temporarily for the alt text generation and are deleted immediately after.

## Project Structure

```
/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── .env
├── .env.example
├── .gitignore
└── server.js
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AadhilKassim/Altagram.git
    cd Altagram
    ```

2.  **Install dependencies:**
    You will need Node.js and npm installed.
    ```bash
    npm install express multer @google/generative-ai dotenv
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google Gemini API key. You can get a key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

    ```
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the server:**
    ```bash
    node server.js
    ```

5.  **Open the application:**
    Open your web browser and navigate to `http://localhost:3000`.

## How to Use

1.  Click on the "Upload Image" button or the attachment icon.
2.  Select an image file from your computer.
3.  The application will display the uploaded image and a "Thinking..." message.
4.  The AI-generated alt text will appear in the chat interface.
