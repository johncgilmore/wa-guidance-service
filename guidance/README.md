# Guidance Documents

This directory contains Washington Department of Revenue interim guidance documents for ESSB 5814.

## Structure

```
guidance/
├── metadata.json           # Version tracking and source URLs
└── wa-guidance/
    ├── software/
    │   └── guidance.txt
    ├── it/
    │   └── guidance.txt
    ├── marketing/
    │   └── guidance.txt
    └── ... (11 categories total)
```

## Updating Guidance

When WA DOR releases new guidance:

1. **Update the relevant `.txt` files** with the new content
2. **Update `metadata.json`** with the new date and version
3. **Bump the package version** (use semantic versioning)
4. **Publish the update** so all users get the latest guidance

## Version Format

We use a `YYYY.N` format for guidance versions:
- `2025.1` - First update in 2025
- `2025.2` - Second update in 2025

This makes it clear when guidance was last refreshed.

## Automation

A GitHub Action runs weekly to remind maintainers to check for updates. See `.github/workflows/check-guidance-updates.yml`.

## Sources

All guidance documents are sourced from:
- [WA DOR ESSB 5814 Resources](https://dor.wa.gov/about/legislative-priorities/essb-5814)
- [WA DOR Digital Products & Services](https://dor.wa.gov/taxes-rates/other-taxes/digital-products-and-services)

