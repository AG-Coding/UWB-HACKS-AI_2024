// let mediaRecorder; // Remove this line
// let recordedChunks = [];
// let videoElement = document.getElementById("videoElement");
// let startRecordingBtn = document.getElementById("startRecordingBtn");
// let stopRecordingBtn = document.getElementById("stopRecordingBtn");
// let playRecordingBtn = document.getElementById("playRecordingBtn");

let model;

// Load the emotion detection model
async function loadModel() {
    try {
        // Load the emotion detection model
        const emotionModel = await tf.loadGraphModel('Emotion.json');
        console.log('Model loaded successfully!');
        return emotionModel;
    } catch (error) {
        console.error('Error loading the model:', error);
        return null;
    }
}

// Function to start detection after model is loaded
async function startDetection() {
    if (!loadModel()) console.log('shit broke asf');
    model = await loadModel();
    if (model) {
        console.log('Model loaded successfully!');
        // Call predictEmotion here or within subsequent functions
        predictEmotion();
    } else {
        console.error('Model not loaded yet.');
    }
}

startDetection(); // Start detection after the model is loaded

// Function to predict emotions from the webcam stream
async function predictEmotion() {
    if (!model) {
        console.error('Model not loaded yet.');
        return;
    }
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const tensor = tf.browser.fromPixels(imageData).resizeNearestNeighbor([48, 48]).toFloat().div(255).expandDims();
    const prediction = model.predict(tensor).dataSync();
    const emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    const predictedEmotion = emotions[maxIndex];
    console.log('Predicted Emotion:', predictedEmotion);
    // Display the predicted emotion or perform further actions
}

loadModel().then((loadedModel) => {
    model = loadedModel;
    console.log('Model loaded successfully!');
    startDetection();
});

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

async function setupCamera() {
    try {
        const constraints = { video: true, audio: false };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Error setting up camera:', error);
    }
}

async function startDetection() {
    await setupCamera();
    startEmotionDetection();
}

// Continuously predict emotions from the webcam stream
function startEmotionDetection() {
    setInterval(predictEmotion, 1000); // Adjust the interval as needed
}
