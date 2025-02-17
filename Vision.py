from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from google.cloud import vision
import base64
import logging
from typing import List, Dict, Union
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
TEMP_IMAGE_PATH = Path("image.jpeg")
LIKELIHOOD_NAMES = (
    "UNKNOWN",
    "VERY_UNLIKELY",
    "UNLIKELY",
    "POSSIBLE",
    "LIKELY",
    "VERY_LIKELY",
)

def process_base64_image(content: str) -> bytes:
    """
    Process base64 encoded image content.
    
    Args:
        content (str): Base64 encoded image string
        
    Returns:
        bytes: Decoded binary image data
    """
    try:
        base64_data = content.split(',')[1]
        return base64.b64decode(base64_data)
    except IndexError:
        raise ValueError("Invalid base64 image format")
    except Exception as e:
        raise ValueError(f"Error processing base64 image: {str(e)}")

def detect_faces(content: str) -> List[Dict[str, Union[float, str]]]:
    """
    Detects faces and their emotional attributes in an image using Google Cloud Vision API.
    
    Args:
        content (str): Base64 encoded image string
        
    Returns:
        List[Dict]: List of detected faces with their emotional attributes
    """
    client = vision.ImageAnnotatorClient()
    
    try:
        # Process and save image temporarily
        binary_data = process_base64_image(content)
        TEMP_IMAGE_PATH.write_bytes(binary_data)
        
        # Read image and perform face detection
        image_content = TEMP_IMAGE_PATH.read_bytes()
        image = vision.Image(content=image_content)
        response = client.face_detection(image=image)
        
        # Clean up temporary file
        TEMP_IMAGE_PATH.unlink(missing_ok=True)
        
        faces = response.face_annotations
        if not faces:
            logger.info("No faces detected in the image")
            return []
            
        # Extract face information
        return [
            {
                "detection_confidence": face.detection_confidence,
                "anger": LIKELIHOOD_NAMES[face.anger_likelihood],
                "joy": LIKELIHOOD_NAMES[face.joy_likelihood],
                "surprise": LIKELIHOOD_NAMES[face.surprise_likelihood],
                "sorrow": LIKELIHOOD_NAMES[face.sorrow_likelihood]
            }
            for face in faces
        ]
        
    except Exception as e:
        logger.error(f"Error in face detection: {str(e)}")
        raise

def create_app() -> Flask:
    """
    Create and configure the Flask application.
    
    Returns:
        Flask: Configured Flask application
    """
    app = Flask(__name__)
    CORS(app)
    
    @app.route('/process_url', methods=['POST', 'OPTIONS'])
    @cross_origin()
    def process_url():
        if request.method == 'OPTIONS':
            return ('', 204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600'
            })
            
        try:
            data = request.get_json()
            if not data or 'url' not in data:
                return jsonify({"error": "URL not found in request data"}), 400
                
            detected_faces = detect_faces(data['url'])
            return jsonify({"faces": detected_faces}), 200
            
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
