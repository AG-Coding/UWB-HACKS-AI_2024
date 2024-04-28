let mediaRecorder;
let recordedChunks = [];
let videoElement = document.getElementById("videoElement");
let startRecordingBtn = document.getElementById("startRecordingBtn");
let stopRecordingBtn = document.getElementById("stopRecordingBtn");
let playRecordingBtn = document.getElementById("playRecordingBtn");

// Speech recognition object
let recognition = new webkitSpeechRecognition();
recognition.continuous = true; // Continuous speech recognition
recognition.interimResults = true; // Get interim results

recognition.onresult = function(event) {
  let interimTranscript = '';
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      // If result is final, print to console
      console.log('Final transcript: ' + event.results[i][0].transcript);
    } else {
      // If result is interim, append to interim transcript
      interimTranscript += event.results[i][0].transcript;
    }
  }
  // Print interim transcript to console
  console.log('Interim transcript: ' + interimTranscript);
};

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
// Request access to the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(function(stream) {
    // Get the video element
    var video = document.createElement('video');
    document.body.appendChild(video);
    video.srcObject = stream;
    video.play();

    // Create an image element
    var img = document.createElement('img');
    document.body.appendChild(img);

    // Function to capture frame as JPEG and display in the <img> tag
    function captureFrame() {
      var canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var dataUrl = canvas.toDataURL('image/jpeg');
      
      // Set the src attribute of the <img> tag to the data URL
      //img.src = dataUrl;

      const result = sendImageToBackend(dataUrl);
      console.log(result);
      return result;
      
    }

    // Capture a frame every second
    setInterval(captureFrame, 5000);
  })
  .catch(function(error) {
    console.error('Error accessing camera:', error);
  });


function sendImageToBackend(url){
  //const url = 'http://example.com';  // The URL you want to send
  const data = { url: url };

  fetch('http://127.0.0.1:5000/process_url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log("data");
    // Log the response from the server
    //console.log(data);  
    return data;
  })
  .catch(error => {
    console.error('Error:', error);
  });

}


// function startWebcam() {
//   let constraints = { video: true, audio: true };

//   navigator.mediaDevices.getUserMedia(constraints)
//     .then(function(mediaStream) {
//       videoElement.srcObject = mediaStream;
//       mediaRecorder = new MediaRecorder(mediaStream);

//       mediaRecorder.ondataavailable = function(event) {
//         recordedChunks.push(event.data);
//       };
//     })
//     .catch(function(err) {
//       console.log(err.name + ": " + err.message);
//     });
// }
// function startRecording() {
//   recordedChunks = [];
//   mediaRecorder.start();
//   startRecordingBtn.disabled = true;
//   stopRecordingBtn.disabled = false;
  
//   // Start speech recognition
//   recognition.start();
// }

// function stopRecording() {
//   mediaRecorder.stop();
//   startRecordingBtn.disabled = false;
//   stopRecordingBtn.disabled = true;
  
//   // Stop speech recognition
//   recognition.stop();
// }

// function playRecording() {
//   let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
//   let recordedUrl = URL.createObjectURL(recordedBlob);
//   let videoPlayer = document.createElement("video");
//   videoPlayer.src = recordedUrl;
//   videoPlayer.controls = true;
//   videoElement.parentElement.appendChild(videoPlayer);
// }
