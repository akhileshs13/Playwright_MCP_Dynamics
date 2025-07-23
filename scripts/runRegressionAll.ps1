# ========================
# Auto Scheduler Setup
# ========================
$taskName = "Playwright_AutoRegression"
$task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if (-not $task) {
  Write-Host "Creating new scheduled task..."
  $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -File `"$PSScriptRoot\runRegressionAll.ps1`""
  $trigger = New-ScheduledTaskTrigger -Daily -At 12:30PM
  Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger `
    -Principal (New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType S4U -RunLevel Highest) `
    -Description "Runs Playwright Regression Daily" -Force
  Write-Host "Scheduled task created: $taskName"
}

# ========================
# Stop on error
# ========================
$ErrorActionPreference = "Stop"

# ========================
# Clean old allure results and report
# ========================
Write-Host "`n Cleaning previous Allure results and reports..."
if (Test-Path "allure-results") { Remove-Item "allure-results" -Recurse -Force }
if (Test-Path "allure-report") { Remove-Item "allure-report" -Recurse -Force }

# ========================
# Regression Test Execution
# ========================
Write-Host "`n Running Regression Tests..."
$env:ENV_FILE = ".env"
$env:TARGET_ENV = "LOCAL"
npx cross-env ENV_FILE=$env:ENV_FILE TARGET_ENV=$env:TARGET_ENV npx playwright test suites/demoTest/regressionFlow.spec.ts --grep "@Demo" --reporter=allure-playwright

# ========================
# Copy environment.properties (optional)
# ========================
$envProps = ".env.test\environment.properties"
Write-Host "`nCopying environment.properties (if available)..."
if (Test-Path $envProps) {
  Copy-Item $envProps -Destination "allure-results" -Force
  Write-Host "Copied environment.properties"
}
else {
  Write-Host "environment.properties not found."
}

# ========================
# Generate Combined Allure Report
# ========================
Write-Host "`n Generating Combined Allure Report..."
ts-node scripts/generateEnvironmentProperties.ts
npx allure generate ./allure-results --clean -o allure-report --name 'Dynamics-365-Project'

# ========================
# Open Combined Report (optional - for local only)
# ========================
Write-Host "Opening Combined Allure Report..."
npx allure open allure-report
