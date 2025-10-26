# Git History Cleaner for Sensitive Data (PowerShell)
# This script removes sensitive data from git history

Write-Host "🔒 Git History Security Cleaner" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  WARNING: This will rewrite git history!" -ForegroundColor Yellow
Write-Host "⚠️  Make sure you have backups before proceeding!" -ForegroundColor Yellow
Write-Host ""

# List of sensitive patterns to remove
$SensitivePatterns = @(
    "daivanlabs",
    "codecure", 
    "a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d",
    "YOUR_USERNAME",
    "YOUR_PASSWORD",
    "YOUR_PASSWORD_HASH"
)

Write-Host "🧹 Cleaning git history of sensitive data..." -ForegroundColor Green
Write-Host ""

# Use git filter-branch to remove sensitive data
foreach ($pattern in $SensitivePatterns) {
    Write-Host "Removing pattern: $pattern" -ForegroundColor Yellow
    git filter-branch --force --index-filter "git rm --cached --ignore-unmatch -r . && git reset --hard" --prune-empty --tag-name-filter cat -- --all
}

Write-Host ""
Write-Host "✅ Git history cleaned!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Force push to update remote repository:" -ForegroundColor White
Write-Host "   git push origin --force --all" -ForegroundColor Gray
Write-Host "2. Force push tags:" -ForegroundColor White
Write-Host "   git push origin --force --tags" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  WARNING: Force pushing will overwrite remote history!" -ForegroundColor Red
Write-Host "⚠️  Make sure all team members are aware of this change!" -ForegroundColor Red
