let mediaRecorder;
let recordedChunks = [];
let videoElement = document.getElementById("videoElement");
let startRecordingBtn = document.getElementById("startRecordingBtn");
let stopRecordingBtn = document.getElementById("stopRecordingBtn");
let playRecordingBtn = document.getElementById("playRecordingBtn");

let isRecording = false;
let lastSpeechTime = Date.now();
let silenceTimer;

const expectedTranscriptLength = 100;

let recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = function(event) {
  let interimTranscript = '';
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      analyzeSpeech(event.results[i][0].transcript);
    } else {
      interimTranscript += event.results[i][0].transcript;
    }
  }
};

function analyzeSpeech(transcript) {
  stopRecording();
  stopWebcam();
  recognition.stop();
  const words = transcript.split(' ');
  const wordCount = words.length;
  const totalCharacters = transcript.replace(/\s/g, '').length;
  const averageWordLength = totalCharacters / wordCount;

  let tone = "Neutral";
  const informalWords = [
    'hey', 'yeah', 'like', 'gonna', 'wanna', 'um', 'cuz', 'kinda', 'gotta', 'lemme',
    // Abbreviated for brevity
  ];

  const containsInformalWord = words.some(word => informalWords.includes(word.toLowerCase()));
  if (containsInformalWord) {
    tone = "Informal";
  } else {
    tone = "Formal";
  }

  const fillerWords = ['um', 'uh', 'er', 'well', 'like', 'you know', 'actually', 'basically', 'literally'];

  const fillerWordCount = words.filter(word => fillerWords.includes(word.toLowerCase())).length;

  const pauseThreshold = 1; // Longer than 1 second is considered significant
  const pauses = transcript.match(/(\s|^)\.{2,}(\s|$)/g); // Find significant pauses
  const pauseCount = pauses ? pauses.length : 0;

  const speechDurationInSeconds = 60;
  const speechRate = (wordCount / speechDurationInSeconds) * 60;

  const fluencyScore = (speechRate * 0.5) - (fillerWordCount * 0.2) - (pauseCount * 0.3);

  const confidence = Math.min(100, Math.max(0, fluencyScore)) * 10;

  const uniqueWords = new Set(words);
  const vocabularyRichness = (uniqueWords.size / wordCount) * 100;

  let feedback = `Speech analysis:\n`;
  feedback += `Word count: ${wordCount}\n`;
  feedback += `Average word length: ${averageWordLength.toFixed(2)}\n`;
  feedback += `Tone: ${tone}\n`;
  feedback += `Speech rate: ${speechRate.toFixed(2)} words per minute\n`;
  feedback += `Fluency score: ${fluencyScore.toFixed(2)}\n`;
  feedback += `Confidence: ${confidence.toFixed(2)}%\n`;
  feedback += `Vocabulary richness: ${vocabularyRichness.toFixed(2)}%\n`;

  if (confidence < 50) {
    feedback += `Your speech confidence seems low. Try to speak more confidently and clearly.\n`;
  }
  if (vocabularyRichness < 20) {
    feedback += `Expand your vocabulary to make your speech more engaging and varied.\n`;
  }

  console.log(feedback);
  console.log("Analyzing speech:", transcript);

  showPopup(feedback, transcript);
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
  recognition.stop();
  stopWebcam();
}

function tryAgain() {
  recordedChunks = [];
  startRecordingBtn.disabled = false;
  stopRecordingBtn.disabled = true;
  closePopup();
  lastSpeechTime = Date.now();
  startWebcam();
  startRecording();
}

function exit() {
  closePopup();
  openTab({ currentTarget: document.getElementById('Tab1') }, 'Tab1');
  recognition.stop();
  stopRecording();
  stopWebcam();
}

function showPopup(analysisResults, transcript) {
  document.getElementById('transcript').innerText = transcript;
  document.getElementById('analysisResults').innerText = analysisResults;
  document.getElementById('popup').style.display = 'block';
}

function openTab(evt, tabName) {
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  let tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");

  if (tabName === "Tab3") {
    startWebcam();
  } else {
    stopWebcam(); // Stop the webcam stream if not on Tab3
    stopRecording(); // Stop recording if not on Tab3
  }
}

function startWebcam() {
  console.log("Webcam turns on!");
  let constraints = { video: true, audio: true };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      videoElement.srcObject = mediaStream;
      mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.ondataavailable = function(event) {
        recordedChunks.push(event.data);
      };
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}

function startRecording() {
  recordedChunks = [];
  mediaRecorder.start();
  startRecordingBtn.disabled = true;
  stopRecordingBtn.disabled = false;
  isRecording = true;
  lastSpeechTime = Date.now();
  recognition.start();

  // Start the silence timer
  silenceTimer = setInterval(checkSilence, 1000); // Check every 60 seconds

  console.log("Recording started");
}

function stopRecording() {
  clearInterval(silenceTimer);

  if (isRecording) {
    mediaRecorder.stop();
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
    isRecording = false; // Reset recording flag

    console.log("Recording stopped");
  }
}

function checkSilence() {
  console.log("Checking silence...");
  const now = Date.now();
  const silenceThreshold = 60000; // 60 seconds

  if (now - lastSpeechTime > silenceThreshold) {
    // If there has been silence for more than the threshold, stop recording
    stopRecording();
  }
}

// Reset the last speech time whenever speech is detected
recognition.onresult = function(event) {
  lastSpeechTime = Date.now(); // Update last speech time
  let interimTranscript = '';
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      analyzeSpeech(event.results[i][0].transcript);
    } else {
      interimTranscript += event.results[i][0].transcript;
    }
  }
};

function playRecording() {
  let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
  let recordedUrl = URL.createObjectURL(recordedBlob);

  // Remove previous video if exists
  let previousVideo = document.getElementById("recordedVideo");
  if (previousVideo) {
    previousVideo.pause(); // Pause the video
    previousVideo.src = ""; // Clear the source
    previousVideo.parentNode.removeChild(previousVideo); // Remove the video element
  }

  let videoPlayer = document.createElement("video");
  videoPlayer.id = "recordedVideo";
  videoPlayer.src = recordedUrl;
  videoPlayer.controls = true;
  videoElement.parentElement.appendChild(videoPlayer);
}

function stopWebcam() {
  if (videoElement.srcObject) {
    let tracks = videoElement.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}
