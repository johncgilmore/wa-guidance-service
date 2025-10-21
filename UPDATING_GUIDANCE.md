# How to Keep Guidance Current

This guide explains how to maintain up-to-date WA DOR guidance documents in this package.

## 📋 The System

### What We Built:

1. **Bundled Guidance** - Guidance files are included IN the npm package
2. **Version Tracking** - `guidance/metadata.json` tracks when each document was updated
3. **Automated Reminders** - GitHub Action creates a weekly issue to check for updates
4. **Easy Updates** - Simple workflow to publish new guidance to all users

## 🔄 Weekly Update Workflow

### Step 1: Check for Updates (Every Monday)

GitHub will automatically create an issue every Monday titled:
> 🔍 Weekly Check: Review WA DOR Guidance for Updates

Visit these pages to check for new guidance:
- [WA DOR ESSB 5814 Resources](https://dor.wa.gov/about/legislative-priorities/essb-5814)
- [WA DOR Digital Products & Services](https://dor.wa.gov/taxes-rates/other-taxes/digital-products-and-services)

### Step 2: If Updates Found

If WA DOR has released new guidance:

```bash
# 1. Add/update the guidance .txt files
# Example: guidance/wa-guidance/software/guidance.txt

# 2. Update metadata
# Edit guidance/metadata.json:
# - Update lastChecked date
# - Update lastUpdated for the specific category
# - Optionally bump version (e.g., 2025.1 -> 2025.2)

# 3. Test locally
npm run build
npm test

# 4. Bump package version
npm version patch  # or 'minor' for significant changes

# 5. Commit and push
git add .
git commit -m "Update [category] guidance - [date/description]"
git push

# 6. Publish to npm
npm publish
```

### Step 3: If No Updates

If nothing has changed:
1. Just close the GitHub issue
2. Add a comment: "Checked [date] - No updates"

## 📁 Directory Structure

```
guidance/
├── metadata.json              # Version tracking
├── README.md                  # Info about this directory
└── wa-guidance/
    ├── software/
    │   └── guidance.txt       # Software guidance content
    ├── it/
    │   └── guidance.txt       # IT guidance content
    ├── marketing/
    │   └── guidance.txt
    ├── webdev/
    │   └── guidance.txt
    ├── engineering/
    │   └── guidance.txt
    ├── staffing/
    │   └── guidance.txt
    ├── security/
    │   └── guidance.txt
    ├── presentations/
    │   └── guidance.txt
    ├── professional-services/
    │   └── guidance.txt
    ├── data-processing/
    │   └── guidance.txt
    ├── contracts/
    │   └── guidance.txt
    └── shared/
        └── das-retail/
            └── guidance.txt   # Cross-cutting guidance
```

## 🎯 Why This Matters

**Value Proposition:**
- Users install your package and get **expert-curated, current guidance**
- You maintain ONE source of truth
- Users automatically get updates when they run `npm update`
- You build trust as the authoritative source for ESSB 5814 guidance

## 🔧 Advanced: Automated Scraping (Future)

You could eventually automate checking WA DOR's website:

```typescript
// Future enhancement: Auto-detect changes
// Check website hash, compare to stored hash
// Create PR automatically when changes detected
```

But for now, weekly manual checks are reliable and ensure quality control.

## 📊 Versioning Strategy

Use semantic versioning with meaning:

- **Patch (0.1.3 -> 0.1.4)**: Updated guidance content, no breaking changes
- **Minor (0.1.4 -> 0.2.0)**: New guidance categories or significant additions
- **Major (0.2.0 -> 1.0.0)**: Breaking API changes or complete guidance overhaul

For guidance version in metadata.json, use:
- **Year.Number**: `2025.1`, `2025.2`, `2026.1`, etc.

## ✅ Checklist Before Publishing

- [ ] All guidance .txt files updated
- [ ] metadata.json dates updated  
- [ ] Tests pass (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Version bumped (`npm version patch`)
- [ ] Changes committed to Git
- [ ] Published to npm (`npm publish`)
- [ ] Git tags pushed (`git push --tags`)

## 📞 Questions?

This is your first npm package - you're learning as you go! The weekly reminder system ensures you don't forget to check, and the version tracking lets users know how current their guidance is.

