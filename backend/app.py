from flask import Flask
from flask_cors import CORS
from extensions import init_extensions, db, bcrypt, jwt, login_manager, cors
import os

def create_app():
    app = Flask(__name__)

    # --- Configuration ---
    app.config.from_object("config.Config")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jobboard.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "devsecret")

    # --- Initialize all extensions ONCE ---
    # (init_extensions already includes db, bcrypt, jwt, login_manager, and CORS)
    init_extensions(app)

    # --- CORS overrides (keep your extended rules) ---
    # This ensures your Vite frontend at both localhost & 127.0.0.1 can talk to Flask
    CORS(
        app,
        origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
        expose_headers=["Content-Type", "Authorization"],
    )

    # --- Import and register blueprints ---
    from routes.auth_routes import auth_bp
    from routes.job_routes import job_bp
    from routes.external.indeed_routes import indeed_bp
    from routes.external.japanjobs_routes import japanjobs_bp
    from routes.external.gaijinpot_routes import gaijinpot_bp
    from routes.aggregate_routes import aggregate_bp
    from routes.health_routes import health_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(job_bp, url_prefix="/api")
    app.register_blueprint(indeed_bp, url_prefix="/api/indeed")
    app.register_blueprint(japanjobs_bp, url_prefix="/api/japanjobs")
    app.register_blueprint(gaijinpot_bp, url_prefix="/api/gaijinpot")
    app.register_blueprint(aggregate_bp, url_prefix="/api/aggregate")
    app.register_blueprint(health_bp, url_prefix="/api")
    
    # --- Create tables ---
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(port=5000, debug=True)
