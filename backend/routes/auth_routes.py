from flask import Blueprint, request, jsonify
from app import db, bcrypt
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["OPTIONS"])
def register_options():
    return jsonify({"ok": True}), 200

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "seeker")  # default to seeker if not provided

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(email=email, password=hashed_pw, role=role)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(
        identity={"id": user.id, "email": user.email, "role": user.role},
        expires_delta=datetime.timedelta(hours=2)
    )
    return jsonify({"access_token": token})
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    """Protected route that returns the logged-in user's identity"""
    identity = get_jwt_identity()
    return jsonify({
        "message": "Authenticated request successful.",
        "user": identity
    }), 200