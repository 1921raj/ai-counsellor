# AI Counsellor Backend

FastAPI backend for the AI Counsellor platform.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up PostgreSQL database:
- Create a database named `ai_counsellor`
- Update `.env` with your database credentials

4. Configure environment variables:
- Copy `.env.example` to `.env`
- Add your Gemini API key

5. Seed the database:
```bash
python seed.py
```

6. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.
