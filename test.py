from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin  # Import CORS


def detect_faces(path):
    """Detects faces in an image."""
    from google.cloud import vision

    client = vision.ImageAnnotatorClient()

    with open(path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.face_detection(image=image)
    faces = response.face_annotations

    # Names of likelihood from google.cloud.vision.enums
    likelihood_name = (
        "UNKNOWN",
        "VERY_UNLIKELY",
        "UNLIKELY",
        "POSSIBLE",
        "LIKELY",
        "VERY_LIKELY",
    )
    print("Faces:")

    for face in faces:
        print(f"anger: {likelihood_name[face.anger_likelihood]}")
        print(f"joy: {likelihood_name[face.joy_likelihood]}")
        print(f"surprise: {likelihood_name[face.surprise_likelihood]}")
        print(f"sorrow: {likelihood_name[face.sorrow_likelihood]}")
        
        vertices = [
            f"({vertex.x},{vertex.y})" for vertex in face.bounding_poly.vertices
        ]

        print("face bounds: {}".format(",".join(vertices)))

    # if response.error.message:
    #     raise Exception(
    #         "{}\nFor more info on error messages, check: "
    #         "https://cloud.google.com/apis/design/errors".format(response.error.message)
    #     )



detect_faces("""sad.jpg""")



# app = Flask(__name__)
# CORS(app)  # Enable CORS for all origins

# @app.route('/process_url', methods=['POST'])
# @cross_origin()  # Allow all origins all methods
# def process_url():
#     data = request.get_json()
#     if 'url' in data:
#         url = data['url']
#         #print("Received URL:", url)
#         print("received ULR")
#         # call api on url
#         detect_faces(url)
#         return jsonify({"message": "URL received successfully."}), 200
#     else:
#         return jsonify({"error": "URL not found in request data."}), 400

# if __name__ == '__main__':
#     app.run(debug=True)
