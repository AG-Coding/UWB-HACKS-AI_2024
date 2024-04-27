import requests
from openai import OpenAI
client = OpenAI(api_key = "sk-proj-2gQR8mkCCo7me1DFI4LYT3BlbkFJhLmhySGY6Zplp7hCMHDe")

js_file_name = "script.js"

with open(js_file_name, "r") as js_file:
    js_code = js_file.read()

# Create a new file on OpenAI and upload the JavaScript code
response = client.files.create(files=[(js_file_name, js_code)])

# Get the URL of the uploaded file
js_file_url = response["url"]

def download_audio(url, output_file):
    response = requests.get(url)
    with open(output_file, 'wb') as f:
        f.write(response.content)

downloaded_audio_path = "downloaded_audio.mp3"
download_audio(js_file_url, downloaded_audio_path)

audio_file= open("/path/to/file/audio.mp3", "rb")
transcription = client.audio.transcriptions.create(
  model="whisper-1", 
  file=audio_file
)
print(transcription.text)
audio_file.close()