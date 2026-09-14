from fastapi import FastAPI

app = FastAPI(title="Clothy AI Service")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "clothy-ai"}