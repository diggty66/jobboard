from flask import Flask
from flask_cors import CORS
from extensions import db, bcrypt, jwt

import os

def create_app():
    app = Flask(__name__)

    # ✅ This line tells Flask to automatically add the CORS headers
    CORS(
        app,
        origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
        expose_headers=["Content-Type", "Authorization"],
    )

    # --- Configuration ---
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jobboard.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "devsecret")

    # --- Initialize extensions ---
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # --- Import and register blueprints ---
    from routes.auth_routes import auth_bp
    from routes.job_routes import job_bp
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(job_bp, url_prefix="/api")

    # --- Create tables ---
    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000, debug=True)
