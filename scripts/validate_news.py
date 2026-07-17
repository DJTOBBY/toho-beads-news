#!/usr/bin/env python3
"""Validate data/news.json against the site's editorial rules.

See CLAUDE.md for the policy this enforces:
- every non-コラム article must carry a verificationQuote proving TOHO is
  actually mentioned in its source, so we don't publish plausible-sounding
  but unverified "collaboration" stories again.
"""
import json
import re
import sys
from pathlib import Path

NEWS_PATH = Path(__file__).resolve().parent.parent / "data" / "news.json"
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TOHO_RE = re.compile(r"toho|トーホー", re.IGNORECASE)
EXEMPT_CATEGORIES = {"コラム"}
REQUIRED_FIELDS = ["id", "title", "category", "country", "date", "summary", "sourceName", "sourceUrl"]


def main():
    errors = []
    warnings = []

    try:
        data = json.loads(NEWS_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"FAIL: news.json is not valid JSON: {e}")
        return 1

    articles = data.get("articles", [])
    seen_ids = set()

    for i, a in enumerate(articles):
        label = a.get("id", f"[index {i}]")

        for field in REQUIRED_FIELDS:
            if not a.get(field):
                errors.append(f"{label}: missing required field '{field}'")

        aid = a.get("id")
        if aid:
            if aid in seen_ids:
                errors.append(f"{label}: duplicate id")
            seen_ids.add(aid)

        date = a.get("date", "")
        if date and not DATE_RE.match(date):
            errors.append(f"{label}: date '{date}' is not YYYY-MM-DD")

        if a.get("category") not in EXEMPT_CATEGORIES:
            quote = a.get("verificationQuote", "")
            if not quote:
                warnings.append(
                    f"{label}: no verificationQuote (legacy article, or needs backfilling)"
                )
            elif not TOHO_RE.search(quote):
                errors.append(
                    f"{label}: verificationQuote does not mention TOHO/トーホー — "
                    "this looks like an unverified claim, see CLAUDE.md"
                )

    print(f"Checked {len(articles)} articles.")
    if warnings:
        print(f"\n{len(warnings)} warning(s):")
        for w in warnings:
            print(f"  - {w}")

    if errors:
        print(f"\n{len(errors)} error(s):")
        for e in errors:
            print(f"  - {e}")
        print("\nFAIL")
        return 1

    print("\nOK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
