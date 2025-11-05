from flask import Blueprint, jsonify
import requests

aggregate_bp = Blueprint("aggregate", __name__)

@aggregate_bp.route("/all")
def aggregate_all():
    base = "http://127.0.0.1:5000"
    try:
        local = requests.get(f"{base}/api/jobs").json()
    except Exception:
        local = []
    try:
        indeed = requests.get(f"{base}/api/indeed/jobs").json()
    except Exception:
        indeed = []
    try:
        jj = requests.get(f"{base}/api/japanjobs/jobs").json()
    except Exception:
        jj = []
    try:
        gp = requests.get(f"{base}/api/gaijinpot/jobs").json()
    except Exception:
        gp = []

    return jsonify(local + indeed + jj + gp)
