"""
ClimaSphere AI Service — Gemini Chatbot Proxy
=============================================
Proxies chat messages from the React frontend to the Google Gemini API.
The API key is never exposed to the browser.

Ported from Disaster-Management-master DisasterChatbot.tsx (client-side
@google/generative-ai → server-side google-generativeai Python SDK).
"""

from __future__ import annotations

import logging
import os
from typing import List

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

load_dotenv()

logger = logging.getLogger(__name__)
router = APIRouter()

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

SYSTEM_PROMPT = (
    "You are SIDMS Guide, an authoritative, calm, and highly intelligent "
    "AI disaster management assistant for Sri Lanka. "
    "Your primary goal is to provide verified, life-saving survival guidance to "
    "citizens before, during, and after disasters like floods and landslides.\n\n"
    "Guidelines:\n"
    "1. Always remain calm, professional, and reassuring.\n"
    "2. Provide step-by-step, actionable advice that is easy to understand.\n"
    "3. If a user states they are in immediate life-threatening danger, explicitly "
    "tell them to contact local emergency services (119) or use the SIDMS "
    "SOS Beacon feature.\n"
    "4. Keep your responses concise; people in emergencies do not have time to "
    "read long paragraphs.\n"
    "5. Base your knowledge on Sri Lankan disaster management protocols "
    "(Disaster Management Centre - DMC).\n"
    "6. NEVER hallucinate medical advice. Provide basic first-aid steps if asked, "
    "but always recommend seeking professional medical help.\n"
    "7. You can communicate in English, but understand if users ask questions "
    "about Sri Lanka."
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------


class ChatMessage(BaseModel):
    role: str   # "user" or "model"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = []
    query: str


class ChatResponse(BaseModel):
    response: str
    model: str = "gemini-2.5-flash"


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Proxy a chat message to the Gemini API and return the response.

    The conversation history is passed as ``messages`` so the model has
    full context; ``query`` is the new user message to send.
    """
    if not _API_KEY:
        raise HTTPException(
            status_code=503,
            detail=(
                "Gemini API key not configured. Set the GEMINI_API_KEY "
                "environment variable in ai-service/.env and restart."
            ),
        )

    try:
        genai.configure(api_key=_API_KEY)

        gemini_model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=SYSTEM_PROMPT,
        )

        # Convert frontend message history to Gemini format
        history = [
            {
                "role": msg.role,
                "parts": [{"text": msg.content}],
            }
            for msg in request.messages
            if msg.role in ("user", "model")
        ]

        chat_session = gemini_model.start_chat(history=history)
        result = chat_session.send_message(request.query)

        logger.info("Gemini chat response received (query_len=%d)", len(request.query))
        return ChatResponse(response=result.text)

    except Exception as exc:
        logger.error("Gemini chat failed: %s", str(exc))
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(exc)}",
        )
