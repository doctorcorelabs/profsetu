#!/bin/bash

# Git History Cleaner for Sensitive Data
# This script removes sensitive data from git history

echo "🔒 Git History Security Cleaner"
echo "================================"
echo ""
echo "⚠️  WARNING: This will rewrite git history!"
echo "⚠️  Make sure you have backups before proceeding!"
echo ""

# List of sensitive patterns to remove
SENSITIVE_PATTERNS=(
    "daivanlabs"
    "codecure"
    "a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d"
    "YOUR_USERNAME"
    "YOUR_PASSWORD"
    "YOUR_PASSWORD_HASH"
)

echo "🧹 Cleaning git history of sensitive data..."
echo ""

# Use git filter-branch to remove sensitive data
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    echo "Removing pattern: $pattern"
    git filter-branch --force --index-filter \
        "git rm --cached --ignore-unmatch -r . && git reset --hard" \
        --prune-empty --tag-name-filter cat -- --all
done

echo ""
echo "✅ Git history cleaned!"
echo ""
echo "📝 Next steps:"
echo "1. Force push to update remote repository:"
echo "   git push origin --force --all"
echo "2. Force push tags:"
echo "   git push origin --force --tags"
echo ""
echo "⚠️  WARNING: Force pushing will overwrite remote history!"
echo "⚠️  Make sure all team members are aware of this change!"
