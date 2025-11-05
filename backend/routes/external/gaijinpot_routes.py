from flask import Blueprint, jsonify
from ._normalize import norm_job

gaijinpot_bp = Blueprint("gaijinpot", __name__)

@gaijinpot_bp.route("/jobs")
def gaijinpot():
    results = [
        norm_job(
            id="gp-301",
            title="English Teacher",
            country="Japan",
            region="Tokyo",
            visa_type="Instructor (E-visa)",
            salary=280000,
            currency="JPY",
            description="Teach English to elementary students.",
            apply_url="https://jobs.gaijinpot.com/job/view/lang/en/job_id/gp-301",
        )
    ]
    return jsonify(results)
