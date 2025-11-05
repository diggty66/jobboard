from flask import Blueprint, jsonify
from ._normalize import norm_job

indeed_bp = Blueprint("indeed", __name__)

@indeed_bp.route("/jobs")
def indeed_jobs():
    # Replace this list with real fetch/adapter when you add credentials
    results = [
        norm_job(
            id="ind-101",
            title="Backend Engineer",
            country="Japan",
            region="Tokyo",
            visa_type="Work Visa",
            salary=8000000,
            currency="JPY",
            description="Maintain and scale server-side systems.",
            apply_url="https://jp.indeed.com/viewjob?jk=ind-101",
        )
    ]
    return jsonify(results)
