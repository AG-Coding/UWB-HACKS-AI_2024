let mediaRecorder;
let recordedChunks = [];
let videoElement = document.getElementById("videoElement");
let startRecordingBtn = document.getElementById("startRecordingBtn");
let stopRecordingBtn = document.getElementById("stopRecordingBtn");
let playRecordingBtn = document.getElementById("playRecordingBtn");

// Initialize Face-API.js
async function initializeFaceAPI() {
  await Promise.all([
    // faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models')
  ]);
  console.log("Models loaded successfully!");
}

async function startWebcam() {
  let constraints = {
    video: {
      width: { ideal: 1920 }, // Adjust the resolution as needed
      height: { ideal: 1080 },
      facingMode: 'environment', // Use the back camera if available
      frameRate: { ideal: 30 }, // Adjust the frame rate as needed
      advanced: [
        { brightness: { ideal: 0 } }, // Adjust brightness level
        { contrast: { ideal: 1 } },   // Adjust contrast level
        { exposureCompensation: { ideal: 0 } }, // Adjust exposure compensation
      ]
    },
    audio: true
  };

  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = function(event) {
      recordedChunks.push(event.data);
    };
  } catch (error) {
    console.error("Error accessing webcam:", error);
  }
}

function startRecording() {
  recordedChunks = [];
  mediaRecorder.start();
  startRecordingBtn.disabled = true;
  stopRecordingBtn.disabled = false;
}

function stopRecording() {
  mediaRecorder.stop();
  startRecordingBtn.disabled = false;
  stopRecordingBtn.disabled = true;
}

function playRecording() {
  let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
  let recordedUrl = URL.createObjectURL(recordedBlob);
  let videoPlayer = document.createElement("video");
  videoPlayer.src = recordedUrl;
  videoPlayer.controls = true;
  videoElement.parentElement.appendChild(videoPlayer);
}

async function detectFaces() {
  const canvas = faceapi.createCanvasFromMedia(videoElement);
  document.body.append(canvas);
  const displaySize = { width: videoElement.width, height: videoElement.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a circle or bounding box around each detected face
    resizedDetections.forEach(detection => {
      const box = detection.box;
      const x = box.x + box.width / 2;
      const y = box.y + box.height / 2;
      const radius = Math.max(box.width, box.height) / 2;

      // Draw a circle around the detected face
      canvas.getContext('2d').beginPath();
      canvas.getContext('2d').lineWidth = 2;
      canvas.getContext('2d').strokeStyle = 'green'; // Change the color as needed
      canvas.getContext('2d').arc(x, y, radius, 0, 2 * Math.PI);
      canvas.getContext('2d').stroke();
    });
  }, 100);
}


async function startWebcamAndDetection() {
  await startWebcam();
  await initializeFaceAPI();
  await detectFaces();
}

startWebcamAndDetection();


function openTab(evt, tabName) {
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}
