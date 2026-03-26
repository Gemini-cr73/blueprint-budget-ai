Write-Host "Setting up Python backend environment..."

cd backend

python -m venv .venv

.\.venv\Scripts\Activate.ps1

pip install fastapi
pip install uvicorn
pip install pydantic
pip install sqlalchemy
pip install psycopg2-binary
pip install python-dotenv

pip freeze > requirements.txt

Write-Host "Backend environment ready."
