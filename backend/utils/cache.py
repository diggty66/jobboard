# backend/utils/cache.py
# ===========================================================
# Simple JSON caching layer for API responses.
# ===========================================================

import os
import json
import time

CACHE_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "cache")
CACHE_TTL = 60 * 60  # 1 hour

os.makedirs(CACHE_DIR, exist_ok=True)

def get_cache_path(source: str) -> str:
    return os.path.join(CACHE_DIR, f"{source}.json")

def load_cache(source: str):
    """Return cached data if it exists and is fresh."""
    path = get_cache_path(source)
    if not os.path.exists(path):
        return None
    try:
        mtime = os.path.getmtime(path)
        if time.time() - mtime < CACHE_TTL:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"Cache load failed for {source}: {e}")
    return None

def save_cache(source: str, data):
    """Save JSON data to cache."""
    path = get_cache_path(source)
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Cache save failed for {source}: {e}")
