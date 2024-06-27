NoteDog
NoteDog is your ultimate note-taking companion, equipped with advanced AI-powered features to help you organize, summarize, and act on your notes efficiently.

Table of Contents
Features
Installation
Environment Variables
Running the Application
Usage
API Endpoints
Project Structure
Contributing
License
Features
AI-Powered Summarization: Summarize your notes using cutting-edge AI models.
Voice Recognition: Take notes on the go with real-time speech-to-text conversion.
Integrated Task Management: Extract tasks from your notes to stay organized and productive.
Image and File Uploads: Enhance your notes with images and documents.
Dark Mode: Switch between light and dark themes for better readability.
Q&A with Contextual Search: Use Bing API for enhanced contextual search in Q&A.
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/NoteDog.git
cd NoteDog
Install dependencies:

Navigate to the backend directory and install the required packages:

bash
Copy code
cd backend
npm install
Environment Variables
Create a .env file in the backend directory with the following environment variables:

plaintext
Copy code
OPENAI_API_KEY=your_openai_api_key
BING_API_KEY=your_bing_api_key
MONGO_URI=mongodb+srv://xw2893:your_password@cluster0ndfree.ouy3vip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0ndfree
JWT_SECRET=your_jwt_secret
Replace your_openai_api_key, your_bing_api_key, your_password, and your_jwt_secret with your actual keys and secrets.

Running the Application
Start the backend server:

bash
Copy code
cd backend
node server.js
Open the frontend:

Open your web browser and navigate to http://localhost:3000.

Usage
Switching Between Tabs
Overview: View the welcome message and learn about NoteDog's features.
Notes: Enter your notes, use voice input, summarize notes, and upload images.
To-Do: Manage your tasks extracted from notes.
Past Notes: View and manage your saved notes.
Q&A: Ask questions and get answers using the AI-powered search.
Dark Mode
Toggle between light and dark themes using the switch in the top-right corner of the header.

API Endpoints
User Registration
URL: /register
Method: POST
Body:
json
Copy code
{
    "email": "user@example.com",
    "password": "your_password"
}
User Login
URL: /login
Method: POST
Body:
json
Copy code
{
    "email": "user@example.com",
    "password": "your_password"
}
Summarize Notes
URL: /summarize
Method: POST
Headers: { Authorization: 'Bearer your_jwt_token' }
Body:
json
Copy code
{
    "notes": "Your notes here"
}
Extract Tasks
URL: /extract-tasks
Method: POST
Headers: { Authorization: 'Bearer your_jwt_token' }
Body:
json
Copy code
{
    "summary": "Your summarized notes here"
}
Break Down Task
URL: /breakdown-task
Method: POST
Headers: { Authorization: 'Bearer your_jwt_token' }
Body:
json
Copy code
{
    "task": "A task to break down"
}
Ask a Question
URL: /ask-question
Method: POST
Headers: { Authorization: 'Bearer your_jwt_token' }
Body:
json
Copy code
{
    "query": "Your question here",
    "context": "Relevant context here"
}
Save Note
URL: /save-note
Method: POST
Headers: { Authorization: 'Bearer your_jwt_token' }
Body:
json
Copy code
{
    "note": "Your note here",
    "summary": "Your summarized note here",
    "todo": "Your to-do items here"
}
Get User Notes
URL: /notes
Method: GET
Headers: { Authorization: 'Bearer your_jwt_token' }
Delete Note
URL: /notes/:id
Method: DELETE
Headers: { Authorization: 'Bearer your_jwt_token' }
Project Structure
plaintext
Copy code
NoteDog/
│
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── node_modules/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
└── README.md
Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

License
This project is licensed under the MIT License.

