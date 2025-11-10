# backend/utils/normalize_jobs.py
# ===========================================================
# Converts various external job data sources into a standard
# Job dictionary schema for the frontend and database.
# ===========================================================

def normalize_jobs(data, source):
    """
    Normalize raw job data from various APIs into a standard format.

    Args:
        data (list or dict): Raw job data returned from an API.
        source (str): Source identifier ('indeed', 'gaijinpot', etc.)

    Returns:
        list[dict]: Normalized job list.
    """

    normalized = []

    if isinstance(data, dict):
        # Sometimes a single job comes as a dict instead of a list
        data = [data]

    for idx, job in enumerate(data):
        j = {}

        if source == "indeed":
            j = {
                "id": str(job.get("id") or idx),
                "title": job.get("jobTitle") or job.get("title", "Unknown Role"),
                "country": job.get("country", "USA"),
                "region": job.get("region") or job.get("location", "Unknown"),
                "visa_type": job.get("visa_type") or "Citizen/GC",
                "salary": job.get("salary") or 0,
                "currency": job.get("currency") or "USD",
                "description": job.get("description") or job.get("snippet", ""),
                "apply_url": job.get("apply_url") or job.get("url", ""),
            }

        elif source == "gaijinpot":
            j = {
                "id": str(job.get("id") or idx),
                "title": job.get("title", "Unknown Position"),
                "country": "Japan",
                "region": job.get("region", "Tokyo"),
                "visa_type": job.get("visa_type", "Work Visa"),
                "salary": job.get("salary") or 0,
                "currency": job.get("currency") or "JPY",
                "description": job.get("description", ""),
                "apply_url": job.get("apply_url", ""),
            }

        elif source == "japanjobs":
            j = {
                "id": str(job.get("id") or idx),
                "title": job.get("title", "Developer"),
                "country": "Japan",
                "region": job.get("region", "Osaka"),
                "visa_type": job.get("visa_type", "Work Visa"),
                "salary": job.get("salary") or 0,
                "currency": job.get("currency") or "JPY",
                "description": job.get("description", ""),
                "apply_url": job.get("apply_url", ""),
            }

        else:
            # fallback / internal DB
            j = {
                "id": str(job.get("id") or idx),
                "title": job.get("title", "Untitled Job"),
                "country": job.get("country", "Unknown"),
                "region": job.get("region", "Unknown"),
                "visa_type": job.get("visa_type", "N/A"),
                "salary": job.get("salary") or 0,
                "currency": job.get("currency") or "USD",
                "description": job.get("description", ""),
                "apply_url": job.get("apply_url", ""),
            }

        normalized.append(j)

    return normalized
