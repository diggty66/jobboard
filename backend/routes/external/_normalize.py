# Helper to normalize external job payloads into our unified schema
def norm_job(
    *,
    id: str | int,
    title: str,
    country: str,
    region: str,
    visa_type: str | None = None,
    salary: int | None = None,
    currency: str | None = None,
    description: str | None = None,
    apply_url: str | None = None,
) -> dict:
    return {
        "id": id,
        "title": title,
        "country": country,
        "region": region,
        "visa_type": visa_type,
        "salary": salary,
        "currency": currency,
        "description": description,
        "apply_url": apply_url,
    }
