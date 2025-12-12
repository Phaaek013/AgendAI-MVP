from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="AgendAI Agent")


class InvokePayload(BaseModel):
    tenant_id: str = Field(..., description="Tenant identifier")
    conversation_id: str = Field(..., description="Conversation identifier")
    incoming_message: str = Field(..., description="Raw user message")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/invoke")
def invoke(payload: InvokePayload):
    # Placeholder for a LangGraph/LangChain pipeline
    assistant_message = (
        "Olá! Sou o assistente da AgendAI. Vamos conectar fluxos e ferramentas em breve."
    )
    return {
        "assistant_message": assistant_message,
        "echo": payload.incoming_message,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
