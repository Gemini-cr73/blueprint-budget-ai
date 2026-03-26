Write-Host "Creating Blueprint Budget AI project structure..."

New-Item -ItemType Directory -Force -Path frontend
New-Item -ItemType Directory -Force -Path backend
New-Item -ItemType Directory -Force -Path data
New-Item -ItemType Directory -Force -Path docs
New-Item -ItemType Directory -Force -Path docker
New-Item -ItemType Directory -Force -Path scripts

New-Item -ItemType Directory -Force -Path backend\api
New-Item -ItemType Directory -Force -Path backend\services
New-Item -ItemType Directory -Force -Path backend\optimization
New-Item -ItemType Directory -Force -Path backend\templates
New-Item -ItemType Directory -Force -Path backend\cost_engine
New-Item -ItemType Directory -Force -Path backend\materials_engine

New-Item -ItemType Directory -Force -Path data\templates
New-Item -ItemType Directory -Force -Path data\cost_tables

New-Item -ItemType Directory -Force -Path frontend\components
New-Item -ItemType Directory -Force -Path frontend\pages
New-Item -ItemType Directory -Force -Path frontend\styles

New-Item -ItemType File -Force -Path README.md
New-Item -ItemType File -Force -Path docker\.env

Write-Host "Project structure created successfully."
