while($true) {
    # Check if there are any changes (staged or unstaged)
    $status = git status --porcelain
    if ($status) {
        Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Changes detected. Syncing to GitHub..." -ForegroundColor Cyan
        
        # Add all changes
        git add .
        
        # Commit with a timestamp
        git commit -m "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        
        # Push to your specified remote and branch
        git push origin-nano-signs main
        
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Done! Changes are now on GitHub." -ForegroundColor Green
        Write-Host "Waiting for next change..." -ForegroundColor Gray
    }
    
    # Wait 30 seconds before checking again
    Start-Sleep -Seconds 30
}
