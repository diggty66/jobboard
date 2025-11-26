# backend/routes/external/gaijinpot_routes.py
from flask import Blueprint, jsonify, request
from utils.scrape_gaijinpot import fetch_gaijinpot_jobs

gaijinpot_bp = Blueprint("gaijinpot", __name__)

@gaijinpot_bp.route("/jobs", methods=["GET"])
def gaijinpot_jobs():
    region = request.args.get("region")

    try:
        # limit=None → scrape ALL available pages
        jobs = fetch_gaijinpot_jobs(limit=None, region=region)
    except Exception as e:
        print(f"[GaijinPot] Error while scraping:", e)
        return jsonify([]), 500

    return jsonify(jobs)
