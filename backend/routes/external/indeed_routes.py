from flask import Blueprint, jsonify
from utils.cache import load_cache, save_cache
from utils.normalize_jobs import normalize_jobs

indeed_bp = Blueprint("indeed", __name__)

@indeed_bp.route("/jobs")
def get_indeed_jobs():
    source = "indeed"

    cached = load_cache(source)
    if cached:
        return jsonify(cached)

    raw_jobs = [
        {
            "id": "us123",
            "jobTitle": "Automotive Technician",
            "location": "New Jersey",
            "country": "USA",
            "salary": 60000,
            "currency": "USD",
            "description": "Diagnose and repair vehicles in a fast-paced shop.",
            "url": "https://www.indeed.com/viewjob?jk=us123",
        },
        {
            "id": "us124",
            "jobTitle": "React Developer",
            "location": "California",
            "country": "USA",
            "salary": 120000,
            "currency": "USD",
            "description": "Work remotely building front-end web applications.",
            "url": "https://www.indeed.com/viewjob?jk=us124",
        },
    ]

    normalized = normalize_jobs(raw_jobs, source)
    save_cache(source, normalized)

    return jsonify(normalized)
