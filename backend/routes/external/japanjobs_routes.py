from flask import Blueprint, jsonify
from ._normalize import norm_job

japanjobs_bp = Blueprint("japanjobs", __name__)

@japanjobs_bp.route("/jobs")
def japanjobs():
    results = [
        norm_job(
            id="jj-501",
            title="Frontend Developer",
            country="Japan",
            region="Osaka",
            visa_type="Work Visa",
            salary=7000000,
            currency="JPY",
            description="Build modern SPA interfaces.",
            apply_url="https://japanjobs.example/jobs/jj-501",
        )
    ]
    return jsonify(results)
