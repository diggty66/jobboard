# backend/routes/external/aggregate_routes.py

from flask import Blueprint, jsonify, current_app, request
import requests

aggregate_bp = Blueprint("aggregate", __name__)

# You can also move this into app config later if you want
JOB_SOURCES = [
    "/api/jobs",             # local DB
    "/api/indeed/jobs",      # Indeed
    "/api/japanjobs/jobs",   # JapanJobs
    "/api/gaijinpot/jobs",   # GaijinPot
]


@aggregate_bp.route("/all")
def aggregate_all():
    # Build base URL from the current request, not hardcoded
    base = request.host_url.rstrip("/")  # e.g. "http://127.0.0.1:5000"
    session = requests.Session()

    all_jobs = []

    for path in JOB_SOURCES:
        url = f"{base}{path}"
        try:
            current_app.logger.info(f"[aggregate] Fetching {url}")
            resp = session.get(url, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            if isinstance(data, list):
                all_jobs.extend(data)
            else:
                current_app.logger.warning(
                    f"[aggregate] Expected list from {url}, got {type(data)}"
                )
        except Exception as e:
            current_app.logger.warning(
                f"[aggregate] Failed to fetch from {url}: {e}"
            )

    return jsonify(all_jobs)
