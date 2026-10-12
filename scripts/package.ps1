$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$version = (Get-Content -Raw -LiteralPath 'manifest.json' | ConvertFrom-Json).version
New-Item -ItemType Directory -Force -Path 'releases' | Out-Null
$archive = Join-Path 'releases' "aqw-wiki-item-preview-$version.zip"
Compress-Archive -Path 'dist\*' -DestinationPath $archive -Force
Write-Output "Paquete creado: $archive"
