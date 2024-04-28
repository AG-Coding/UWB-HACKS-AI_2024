from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import base64
def detect_faces(content):
    """Detects faces in an image."""
    from google.cloud import vision

    client = vision.ImageAnnotatorClient()
    base64_data = content.split(',')[1]

    # Decode the Base64 string into bytes
    binary_data = base64.b64decode(base64_data)

    # with open("/Users/james/Desktop/code/github/UWB-HACKS-AI_2024/output.txt", "w") as file:
    #     file.write(str(binary_data))
    # with open('image.jpeg', 'wb') as f:
    #     f.write(binary_data)

    # with open("/Users/james/Desktop/code/github/UWB-HACKS-AI_2024/image.jpeg", "rb") as image_file:
    #     content = image_file.read()

    image = vision.Image(content=binary_data)

    response = client.face_detection(image=image)
    faces = response.face_annotations

    if not faces:
        print("No faces detected in the image.")
        return []

    # Names of likelihood from google.cloud.vision.enums
    likelihood_name = (
        "UNKNOWN",
        "VERY_UNLIKELY",
        "UNLIKELY",
        "POSSIBLE",
        "LIKELY",
        "VERY_LIKELY",
    )
    #print("Faces:")

    face_info = []
    for face in faces:
        detection_confidence = face.detection_confidence
        anger = likelihood_name[face.anger_likelihood]
        joy = likelihood_name[face.joy_likelihood]
        surprise = likelihood_name[face.surprise_likelihood]
        sorrow = likelihood_name[face.sorrow_likelihood]
        face_info.append({
            "detection_confidence": detection_confidence,
            "anger": anger,
            "joy": joy,
            "surprise": surprise,
            "sorrow": sorrow
        })
    return face_info
        # vertices = [
        #     f"({vertex.x},{vertex.y})" for vertex in face.bounding_poly.vertices
        # ]

        #("face bounds: {}".format(",".join(vertices)))

    # Rest of the code for processing detected faces

    # if response.error.message:
    #     raise Exception(
    #         "{}\nFor more info on error messages, check: "
    #         "https://cloud.google.com/apis/design/errors".format(response.error.message)
    #     )



# detect_faces("""sad.jpg""")


app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

@app.route('/process_url', methods=['POST', 'OPTIONS'])  # Include OPTIONS method
@cross_origin()  # Allow all origins all methods
def process_url():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'  # Cache preflight response for 1 hour
        }
        return ('', 204, headers)  # Respond to preflight request with empty body

    if request.method == 'POST':
        data = request.get_json()
        if 'url' in data:
            url = data['url']
            detected_faces = detect_faces(url)
            print(detected_faces)
            return jsonify({"face": detected_faces}), 200
        else:
            return jsonify({"error": "URL not found in request data."}), 400

if __name__ == '__main__':
    app.run(debug=True)
