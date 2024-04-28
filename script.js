let mediaRecorder;
let recordedChunks = [];
let videoElement = document.getElementById("videoElement");
let startRecordingBtn = document.getElementById("startRecordingBtn");
let stopRecordingBtn = document.getElementById("stopRecordingBtn");
let playRecordingBtn = document.getElementById("playRecordingBtn");

let isRecording = false;
let lastSpeechTime = Date.now();
let silenceTimer;

let recordingStartTime;
let recordingEndTime;


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
    'ain\'t', 'y\'all', 'ya', 'dunno', 'gimme', 'howdy', 'yikes', 'dang', 'haha', 
    'yup', 'noob', 'cool', 'awesome', 'totally', 'seriously', 'okay', 'alright', 
    'yeah', 'yo', 'hmm', 'oops', 'oh', 'wow', 'whoa', 'dude', 'bro', 'chill', 
    'kidding', 'ugh', 'eh', 'meh', 'bleh', 'whatever', 'darn', 'nah', 'mhm', 'ugh', 
    'yay', 'welp', 'yeah', 'yikes', 'freakin', 'dang', 'damn', 'yep', 'nope', 'huh', 
    'hmm', 'wow', 'whoa', 'meh', 'huh', 'oops', 'yeet', 'yadda yadda', 'kinda', 'sorta',
    'wanna', 'gonna', 'gotta', 'shoulda', 'coulda', 'woulda', 'musta', 'mighta', 'oughta', 
    'wounda', 'outta', 'hafta', 'betcha', 'ain\'t', 'mightn\'t', 'oughtn\'t', 'shan\'t', 
    'won\'t', 'isn\'t', 'aren\'t', 'haven\'t', 'hasn\'t', 'doesn\'t', 'didn\'t', 'can\'t', 
    'couldn\'t', 'shouldn\'t', 'wouldn\'t', 'mightn\'t', 'used to', 'lemme', 'gimme', 
    'wanna', 'gonna', 'hafta', 'oughta', 'kinda', 'sorta', 'musta', 'oughta', 
    'coulda', 'shoulda', 'woulda', 'mighta', 'ain\'t', 'let\'s', 'gotta', 'waddya', 
    'outta', 'betcha', 'c\'mon', 'gosh', 'gee', 'darn', 'shoot', 'heck', 'dangit',
    'fudge', 'frick', 'friggin', 'freakin', 'flip', 'crap', 'dang', 'dangit', 'crapola', 
    'doggone', 'baloney', 'shucks', 'crap', 'crud', 'dang', 'darn', 'dagnabbit', 'drat', 
    'gee', 'golly', 'gosh', 'heck', 'hooey', 'jeez', 'oh man', 'oh boy', 'rats', 'shoot',
    'shucks', 'son of a gun', 'crap', 'dammit', 'damned', 'goddamn', 'hell', 'bloody hell', 
    'damn it', 'goddammit', 'god damn it', 'jesus', 'jesus christ', 'for god\'s sake', 
    'for christ\'s sake', 'good lord', 'oh my god', 'oh my gosh', 'oh dear', 'oh no', 
    'oh dear me', 'dear me', 'oh fudge', 'oh heck', 'oh sugar', 'oh shoot', 'oh nuts', 
    'oh man', 'oh boy', 'oh brother', 'oh sister', 'oh heavens', 'oh my word', 'oh la la',
    'oh crikey', 'yikes', 'yowza', 'wow', 'wowza', 'whoa', 'whoops', 'whoopsie', 'whoops-a-daisy',
    'whoopsy-daisy', 'whoopsie-doodle', 'oopsy', 'oopsy-daisy', 'oopsie-doodle', 'oops-a-daisy',
    'oopsie-daisy', 'whoopsie-doo', 'shh', 'shhh', 'shush', 'shut up', 'quiet', 'hush', 
    'be quiet', 'keep it down', 'zip it', 'can it', 'give it a rest', 'pipe down', 'enough', 
    'hold your tongue', 'shut your mouth', 'button it', 'belt up', 'shut it', 'knock it off', 
    'put a sock in it', 'cool it', 'chill out', 'calm down', 'take a chill pill', 'relax', 
    'take it easy', 'unwind', 'decompress', 'let your hair down', 'chillax', 'chillaxin', 
    'chillin', 'chillin\'', 'relaxin', 'relaxin\'', 'mellow out', 'kick back', 'chill out', 
    'chilled out', 'relaxed', 'cool', 'chillaxed', 'mellow', 'easygoing', 'laid-back', 
    'calm', 'calm and collected', 'unflappable', 'unexcitable', 'peaceful', 'tranquil', 
    'serene', 'undisturbed', 'untroubled', 'unperturbed', 'at ease', 'composed', 
    'together', 'placid', 'cool-headed', 'self-possessed', 'easy', 'level-headed', 
    'even-tempered', 'happy-go-lucky', 'lazy', 'happy', 'satisfied', 'content', 
    'satisfied', 'glad', 'pleased', 'pleasurable', 'grateful', 'enjoyable', 'gratified', 
    'fulfilled', 'well-pleased', 'thankful', 'sunny', 'joyful', 'upbeat', 'joyous', 'cheerful', 
    'merry', 'good-humored', 'spirited', 'jolly', 'high-spirited', 'bright', 'breezy', 'sparkling', 
    'buoyant', 'sunny', 'optimistic', 'lighthearted', 'light-hearted', 'carefree', 'lively', 'vivacious', 
    'fun-loving', 'animated', 'gay', 'playful', 'sprightly', 'witty', 'humorous', 'amusing', 'jocular', 
    'joking', 'jesting'];

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

  const uniqueWords = new Set(words);
  const vocabularyRichness = (uniqueWords.size / wordCount) * 100;

  const speechDurationInSeconds = (recordingEndTime - recordingStartTime) / 1000;
  const speechRate = (wordCount / speechDurationInSeconds) * 60;

  const fluencyScore = ((speechRate * 0.5) - (fillerWordCount * 0.2) - (pauseCount * 0.3));

  const normalizedVocabularyRichness = (vocabularyRichness / 100) * 100;
  const normalizedFluencyScore = (fluencyScore / 200) * 100;
  const vocabularyRichnessWeight = 0.1;
  const fluencyScoreWeight = 0.9; 
  const weightedVocabularyRichness = normalizedVocabularyRichness * vocabularyRichnessWeight;
  const weightedFluencyScore = normalizedFluencyScore * fluencyScoreWeight;
  const confidence = Math.min(100, Math.max(0, weightedVocabularyRichness + weightedFluencyScore));


  let feedback = `Speech analysis:\n`;
  feedback += `Word count: ${wordCount}\n`;
  feedback += `Average word length: ${averageWordLength.toFixed(2)}\n`;
  feedback += `Tone: ${tone}\n`;
  feedback += `Speech rate: ${speechRate.toFixed(2)} words per minute\n`;
  feedback += `Fluency score: ${fluencyScore.toFixed(2)}\n`;
  feedback += `Confidence: ${confidence.toFixed(2)}%\n`;
  feedback += `Vocabulary richness: ${vocabularyRichness.toFixed(2)}%\n`;

  if (confidence < 78) {
    feedback += `Your speech confidence seems low. Try to speak more confidently and clearly.\n`;
  }
  if (vocabularyRichness < 55) {
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
  recordingStartTime = Date.now(); // Record start time
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
  recordingEndTime = Date.now(); // Record end time

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

  
  while (Boolean(now - lastSpeechTime < silenceThreshold)) {
    continue;
  }
  stopRecording();
  stopWebcam();
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