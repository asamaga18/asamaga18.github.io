from flask import Flask, request, jsonify
from flask_cors import CORS
from models import User, Session


app = Flask(__name__)
CORS(app)

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
