# TTS-Coq


tts-voice-generator/
│── backend/                  # Node.js + Express Backend
│   ├── server.js             # Main backend server
│   ├── package.json          # Backend dependencies
│   ├── .env                  # Environment variables
│   └── uploads/              # Generated audio files
│
│── frontend/                 # React Frontend
│   ├── src/
│   │   ├── App.jsx           # Main React App
│   │   ├── index.js          # React entry point
│   │   └── components/       # UI Components
│   ├── public/
│   │   └── index.html
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # TailwindCSS config
│
│── coqui/                    # Python Coqui TTS Engine
│   ├── requirements.txt      # Coqui dependencies
│   ├── run_tts_server.sh     # Script to start TTS server
│   └── README.md
│
│── README.md                 # Project Documentation
│── docker-compose.yml        # (Optional) For containerized setup
