from flask import Blueprint, jsonify, request
from utils.scrape_gaijinpot_feed import fetch_gaijinpot_jobs_feed

gaijinpot_bp = Blueprint("gaijinpot", __name__)

@gaijinpot_bp.route("/api/gaijinpot/jobs")
def gaijinpot_jobs():
    region = request.args.get("region")
    jobs = fetch_gaijinpot_jobs_feed()

    # If region is provided, match roughly (e.g., JP-13 = Tokyo)
    if region:
        region_lower = region.lower()
        jobs = [j for j in jobs if region_lower in (j.get("region", "").lower())]

    return jsonify(jobs)
