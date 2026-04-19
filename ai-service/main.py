from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import predict, train, health, chat

app = FastAPI(
    title="SIDMS AI Service",
    description="Sri Lanka Integrated Disaster Management System — AI guidance",
    version="1.0.0",
)

# CORS – allow all in dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(train.router, prefix="/models", tags=["Training"])
app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])


@app.get("/")
async def root():
    return {
        "service": "ClimaSphere AI Service",
        "version": "1.0.0",
        "docs": "/docs",
    }
