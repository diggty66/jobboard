from flask import Blueprint, jsonify, request
from app import db
from models import Job

job_bp = Blueprint("job", __name__)

@job_bp.route("/countries")
def get_countries():
    return jsonify(["Japan", "USA", "Germany"])

@job_bp.route("/regions")
def get_regions():
    country = request.args.get("country")
    data = {
        "Japan": ["Tokyo", "Osaka"],
        "USA": ["New Jersey", "California"],
        "Germany": ["Berlin", "Hamburg"],
    }
    return jsonify(data.get(country, []))

@job_bp.route("/jobs")
def get_jobs():
    jobs = Job.query.all()
    if not jobs:
        job = Job(
            title="Software Engineer",
            country="Japan",
            region="Tokyo",
            visa_type="Work Visa",
            salary=85000,
            currency="USD",
            description="Develop scalable applications."
        )
        db.session.add(job)
        db.session.commit()
        jobs = [job]
    return jsonify([
        {
            "id": j.id,
            "title": j.title,
            "country": j.country,
            "region": j.region,
            "visa_type": j.visa_type,
            "salary": j.salary,
            "currency": j.currency,
            "description": j.description,
        } for j in jobs
    ])
