from flask import Flask, request, jsonify
from flask_cors import CORS
from models import User, Session, Base, engine
from chat_routes import chat_bp
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Configure CORS to allow all origins and methods
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type"],
        "max_age": 3600
    }
})

# Ensure database tables exist
Base.metadata.create_all(engine)

# Register the chat blueprint
app.register_blueprint(chat_bp, url_prefix='/chat')

@app.route('/')
def home():
    logger.debug("Home endpoint called")
    return jsonify({'message': 'Server is running'})

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/auth', methods=['POST'])
def auth_user():
    data = request.get_json()
    session = Session()

    user = session.query(User).filter_by(google_id=data['sub']).first()
    if not user:
        user = User(
            google_id=data['sub'],
            email=data['email'],
            first_name=data.get('given_name', ''),
            last_name=data.get('family_name', ''),
            has_account=False
        )
        session.add(user)
    else:
        user.first_name = data.get('given_name', user.first_name)
        user.last_name = data.get('family_name', user.last_name)

    session.commit()
    session.close()
    return jsonify({'message': 'User authenticated', 'has_account': user.has_account})

@app.after_request
def after_request(response):
    logger.debug(f"Request: {request.method} {request.path} -> Response: {response.status_code}")
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    # Use 0.0.0.0 to allow external connections
    app.run(host='0.0.0.0', port=8000, debug=True)
