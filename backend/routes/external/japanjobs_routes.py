from flask import Blueprint, jsonify
from utils.cache import load_cache, save_cache
from utils.normalize_jobs import normalize_jobs

japanjobs_bp = Blueprint("japanjobs", __name__)

@japanjobs_bp.route("/jobs")
def get_japanjobs_jobs():
    source = "japanjobs"

    cached = load_cache(source)
    if cached:
        return jsonify(cached)

    raw_jobs = [
        {
            "id": 1,
            "title": "Full Stack Developer",
            "region": "Tokyo",
            "salary": 8000000,
            "currency": "JPY",
            "description": "Work with a Japanese startup on scalable backend systems.",
            "apply_url": "https://www.japanjobs.jp/jobs/fullstack-developer/",
        },
        {
            "id": 2,
            "title": "Marketing Specialist",
            "region": "Kyoto",
            "salary": 6000000,
            "currency": "JPY",
            "description": "Plan and execute online campaigns for Japanese products.",
            "apply_url": "https://www.japanjobs.jp/jobs/marketing-specialist/",
        },
    ]

    normalized = normalize_jobs(raw_jobs, source)
    save_cache(source, normalized)

    return jsonify(normalized)
