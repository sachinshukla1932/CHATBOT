const chatBox = document.getElementById('chatBox');
const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const playButton = document.getElementById('playButton');

let recordedAudio = null;

// Function to add messages to the chat box
function addMessageToChat(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-bubble');
  messageElement.textContent = message;
  if (sender === 'user') {
    messageElement.classList.add('user-bubble');
  } else {
    messageElement.classList.add('bot-bubble');
  }
  chatBox.appendChild(messageElement);
}

// Audio recording functionality
let mediaRecorder;
let chunks = [];

recordButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      recordedAudio = blob;
      playButton.disabled = false;
    };

    mediaRecorder.start();
    stopButton.disabled = false;
    recordButton.disabled = true;
  } catch (err) {
    console.error('Error accessing microphone:', err);
  }
});

stopButton.addEventListener('click', () => {
  mediaRecorder.stop();
  stopButton.disabled = true;
  recordButton.disabled = false;
});

playButton.addEventListener('click', () => {
  const audioURL = URL.createObjectURL(recordedAudio);
  const audio = new Audio(audioURL);
  audio.play();
});

// Example chatbot message
setTimeout(() => {
  addMessageToChat("Hello! How can I assist you today?", 'bot');
}, 1000);
let currentAudio;

playButton.addEventListener('click', () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audioURL = URL.createObjectURL(recordedAudio);
  currentAudio = new Audio(audioURL);
  currentAudio.play();
});

stopButton.addEventListener('click', () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null; // Reset the current audio element
  }
});
