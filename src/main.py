from fastapi import FastAPI
from src.routers import box_router, feedback_router

app = FastAPI()

app.include_router(box_router.router)
app.include_router(feedback_router.router)

@app.get("/health")
def health():
    return {"status": "ok"}