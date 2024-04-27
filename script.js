let mediaRecorder;
let recordedChunks = [];
let videoElement = document.getElementById("videoElement");
let startRecordingBtn = document.getElementById("startRecordingBtn");
let stopRecordingBtn = document.getElementById("stopRecordingBtn");
let playRecordingBtn = document.getElementById("playRecordingBtn");

// Define the expected length of the transcript (for example, 100 characters)
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
  const words = transcript.split(' ');
  const wordCount = words.length;
  const totalCharacters = transcript.replace(/\s/g, '').length;
  const averageWordLength = totalCharacters / wordCount;
  
  let tone = "Neutral";
  const informalWords = ['hey', 'yeah', 'like', 'gonna', 'wanna'];
  const containsInformalWord = words.some(word => informalWords.includes(word.toLowerCase()));
  if (containsInformalWord) {
    tone = "Informal";
  } else {
    tone = "Formal";
  }

  // Calculate confidence based on the length of the recognized text
  const confidence = (transcript.length / expectedTranscriptLength) * 100;

  // Calculate vocabulary richness (example)
  const uniqueWords = new Set(words);
  const vocabularyRichness = (uniqueWords.size / wordCount) * 100;

  // Prepare feedback message
  let feedback = `Speech analysis:\n`;
  feedback += `Word count: ${wordCount}\n`;
  feedback += `Average word length: ${averageWordLength.toFixed(2)}\n`;
  feedback += `Tone: ${tone}\n`;
  feedback += `Confidence: ${confidence.toFixed(2)}%\n`;
  feedback += `Vocabulary richness: ${vocabularyRichness.toFixed(2)}%\n`;

  // Provide suggestions based on analysis (example)
  if (confidence < 50) {
    feedback += `Your speech confidence seems low. Try to speak more confidently and clearly.\n`;
  }
  if (vocabularyRichness < 20) {
    feedback += `Expand your vocabulary to make your speech more engaging and varied.\n`;
  }

  console.log(feedback);  
  console.log("Analyzing speech:", transcript);
  
  // Display feedback in a popup
  showPopup(feedback, transcript);
}


function closePopup() {
  
  // Close the popup
  document.getElementById('popup').style.display = 'none';
}

function tryAgain() {
  recordedChunks = [];
  startRecordingBtn.disabled = false;
  stopRecordingBtn.disabled = true;
  closePopup();
}

function exit() {
  tryAgain()
  openTab(Event.srcElement, 'Tab1');

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
  }
}

function startWebcam() {
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
  
  recognition.start();
}

function stopRecording() {
  mediaRecorder.stop();
  startRecordingBtn.disabled = false;
  stopRecordingBtn.disabled = true;
  
  recognition.stop();
}

function playRecording() {
  let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
  let recordedUrl = URL.createObjectURL(recordedBlob);
  let videoPlayer = document.createElement("video");
  videoPlayer.src = recordedUrl;
  videoPlayer.controls = true;
  videoElement.parentElement.appendChild(videoPlayer);
}
