# UWB-HACKS-AI_2024

# VocalVista

## Inspiration
The inspiration behind VocalVista stems from the desire to empower individuals to communicate more effectively and understand themselves better. By leveraging technology to analyze speech and provide personalized feedback, we aim to help people overcome communication barriers, enhance their self-awareness, and ultimately, enrich their lives.

## What It Does
VocalVista is a speech analysis tool that provides insights into various aspects of verbal communication and personality traits. It analyzes speech patterns, tone, and delivery to offer feedback on communication effectiveness.

### Key Features
- **Recording and Analyzing Speech:** Uses the Web Speech API's to transcribe speech input in real-time. Analyzes speech for metrics such as:
  - Word count
  - Average word length
  - Tone (formal or informal)
  - Speech rate
  - Fluency score
  - Vocabulary richness
  - Confidence level
- **Emotion Analysis:** Captures the user's facial expressions using the webcam and sends frames to a backend server for emotion analysis.
- **Media Recording:** Implements the MediaRecorder API for audio and video recording, with silence detection for automatic stop.
- **Feedback and Suggestions:** Highlights areas for improvement such as low speech confidence or limited vocabulary richness and provides actionable feedback.

## How We Built It
- **Backend:** Built using Flask and Python. The backend processes speech data, performs sentiment analysis with advanced natural language processing techniques, and provides real-time feedback.
- **Frontend:** Developed using HTML, CSS, and JavaScript. The frontend interacts with the backend via `fetch` POST requests and integrates with the Web Speech API for transcription and analysis.
- **Webcam Integration:** Captures real-time video for facial expression analysis.
- **Tools and Libraries:**
  - Python libraries: `vaderSentiment`, `flask`, `flask_cors`, `google.cloud`
  - Google Cloud for AI-powered services
  - HTTP server for frontend hosting

## Accomplishments
- Developed a robust speech analysis tool capable of real-time feedback.
- Integrated advanced AI for sentiment analysis and emotion detection.
- Designed and implemented a seamless user interface with Figma and converted it to a functional webpage.

## What We Learned
- Designing and converting Figma prototypes into web pages.
- Setting up a Flask backend and interacting with it using JavaScript.
- Hosting and running a front-end server using `http-server`.
- Leveraging Google Cloud services for AI-driven analysis.

## What’s Next for VocalVista
- Support for multiple languages.
- Interactive mock interviews with dynamic questioning.
- Enhanced detection of microexpressions (e.g., regret, hesitation).
- Mobile application development.
- Solutions tailored for corporate training.

## Built With
- CSS
- Flask
- Google Cloud
- HTML5
- HTTP Server
- JavaScript
- Python

## Prerequisites
### Modules to Install
To run this project, you need to install the following Python modules:
```bash
pip install vaderSentiment google.cloud flask flask_cors
```
Additionally, ensure the following:
- A Google Cloud authenticated account and local ADC.
- A Google Cloud project with the necessary APIs enabled.

## Running the Project
1. **Start the Python Backend:**
   ```bash
   python Vision.py
   ```
2. **Run the Frontend:**
   ```bash
   http-server -p 3000
   ```
   (Install http-server via Homebrew if not already installed: `brew install http-server`)
3. **Open the Frontend:**
   Open the `.html` file for the frontend in your browser.

---
By building VocalVista, we hope to enhance how people communicate and understand themselves through the power of AI and technology. Let’s shape better conversations together!
