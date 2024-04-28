import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('Tab1');

  const openTab = (event, tabId) => {
    setActiveTab(tabId);
  };

  const closePopup = () => {
    // Close the popup by hiding it
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
  };
  
  const tryAgain = () => {
    // Reset any necessary state or perform actions needed to try again
    console.log('Trying again...');
    // For example, reset form fields:
    document.getElementById('formField1').value = '';
    document.getElementById('formField2').value = '';
    // Clear any error messages
    document.getElementById('errorMessage').innerText = '';
  };
  
  const exit = () => {
    // Exit the application or perform any cleanup actions
    console.log('Exiting application...');
    // For example, redirect to a thank you page:
    window.location.href = 'thankyou.html';
    // Or simply close the current tab:
    window.close();
  };
  
  const startRecording = () => {
    // Start recording video
    const videoElement = document.getElementById('videoElement');
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  };
  
  const stopRecordingManually = () => {
    // Stop recording video manually
    const videoElement = document.getElementById('videoElement');
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
  
    tracks.forEach((track) => {
      track.stop();
    });
    videoElement.srcObject = null;
  };
  
  const playRecording = () => {
    // Play the recorded video
    const videoElement = document.getElementById('videoElement');
    videoElement.play();
  };
  

  return (
    <div className="tab-container">
      <button id="defaultOpen" className="tablinks" onClick={(event) => openTab(event, 'Tab1')}>Home</button>
      <button className="tablinks" onClick={(event) => openTab(event, 'Tab3')}>Tab 3</button>

      <div id="Tab1" className={`tabcontent ${activeTab === 'Tab1' ? 'active' : ''}`}>
        <iframe src="downright intrepid hummingbird-html (1)/index.html"></iframe>
      </div>

      <div id="Tab3" className={`tabcontent ${activeTab === 'Tab3' ? 'active' : ''}`}>
        <div className="split">
          <div id="video-container" className="split-item">
            <video id="videoElement" autoPlay></video>
            <button id="startRecordingBtn" onClick={startRecording}>Start Recording</button>
            <button id="stopRecordingBtn" onClick={stopRecordingManually}>Stop Recording</button>
            <button id="playRecordingBtn" onClick={playRecording}>Play Recording</button>
          </div>
          <div id="avatar-container" className="split-item">
            {/* Placeholder for 2D avatar */}
            <div id="avatar-2d">
              {/* Placeholder image for 2D avatar */}
              <img src="avatar.jpeg" alt="2D Avatar" />
            </div>
          </div>
        </div>
      </div>

      {/* Popup container */}
      <div id="popup" className="popup-container">
        <div className="popup-content">
          <span className="close" onClick={closePopup}>&times;</span>
          <div><strong>Transcript:</strong> <span id="transcript"></span></div>
          <div><strong>Analysis Results:</strong></div>
          <div id="analysisResults"></div>
          <button onClick={tryAgain}>Try Again</button>
          <button onClick={exit}>Exit</button>
        </div>
      </div>
    </div>
  );
}

export default App;