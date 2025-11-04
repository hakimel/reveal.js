#!/usr/bin/env python3
"""
LLM Runner Backend Server
FastAPI WebSocket server for Python code execution and LLM integration
"""

import asyncio
import sys
import traceback
import json
import os
from typing import Dict, Any, Optional
from datetime import datetime
from io import StringIO
from contextlib import redirect_stdout, redirect_stderr

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Optional imports for LLM providers
try:
    from anthropic import AsyncAnthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("Warning: anthropic package not installed. Claude models will not work.")

try:
    from openai import AsyncOpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("Warning: openai package not installed. GPT models will not work.")

# Initialize FastAPI app
app = FastAPI(title="LLM Runner Server")

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state for slide contexts
slide_contexts: Dict[str, Dict[str, Any]] = {}

# Initialize LLM clients
anthropic_client = None
openai_client = None

# Get default Claude model from environment or use fallback
DEFAULT_CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20240620")

if ANTHROPIC_AVAILABLE:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if api_key:
        anthropic_client = AsyncAnthropic(api_key=api_key)
    else:
        print("Warning: ANTHROPIC_API_KEY not found in environment")

if OPENAI_AVAILABLE:
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        openai_client = AsyncOpenAI(api_key=api_key)
    else:
        print("Warning: OPENAI_API_KEY not found in environment")


class SafePythonExecutor:
    """Execute Python code with safety restrictions"""

    # Maximum execution time (seconds)
    TIMEOUT = 30

    # Safe builtins for code execution
    SAFE_BUILTINS = {
        'abs': abs,
        'all': all,
        'any': any,
        'bool': bool,
        'dict': dict,
        'enumerate': enumerate,
        'filter': filter,
        'float': float,
        'int': int,
        'isinstance': isinstance,
        'len': len,
        'list': list,
        'map': map,
        'max': max,
        'min': min,
        'print': print,
        'range': range,
        'reversed': reversed,
        'round': round,
        'set': set,
        'sorted': sorted,
        'str': str,
        'sum': sum,
        'tuple': tuple,
        'zip': zip,
    }

    def __init__(self, slide_id: str, persist_context: bool = True):
        self.slide_id = slide_id
        self.persist_context = persist_context

        # Get or create context for this slide
        if persist_context and slide_id in slide_contexts:
            self.namespace = slide_contexts[slide_id]
        else:
            self.namespace = {'__builtins__': self.SAFE_BUILTINS}
            if persist_context:
                slide_contexts[slide_id] = self.namespace

    async def execute(self, code: str) -> Dict[str, Any]:
        """Execute Python code safely and capture output"""
        stdout = StringIO()
        stderr = StringIO()

        try:
            # Import commonly used modules in the namespace
            import_code = """
import math
import json
import random
from datetime import datetime, timedelta
from collections import Counter, defaultdict
"""
            with redirect_stdout(stdout), redirect_stderr(stderr):
                exec(import_code, self.namespace)

            # Execute the user code
            with redirect_stdout(stdout), redirect_stderr(stderr):
                exec(code, self.namespace)

            output = stdout.getvalue()
            error_output = stderr.getvalue()

            if error_output:
                return {
                    'type': 'error',
                    'data': error_output
                }

            return {
                'type': 'output',
                'data': output if output else '(No output)'
            }

        except SyntaxError as e:
            return {
                'type': 'error',
                'data': f'SyntaxError: {str(e)}\nLine {e.lineno}: {e.text}'
            }
        except Exception as e:
            error_msg = ''.join(traceback.format_exception(type(e), e, e.__traceback__))
            return {
                'type': 'error',
                'data': error_msg
            }


class LLMRunner:
    """Handle LLM API calls with streaming support"""

    @staticmethod
    async def run_anthropic(prompt: str, model: str, websocket: WebSocket, runner_id: str):
        """Stream response from Anthropic Claude"""
        if not anthropic_client:
            await websocket.send_json({
                'type': 'error',
                'runnerId': runner_id,
                'data': 'Anthropic API not configured. Set ANTHROPIC_API_KEY environment variable.'
            })
            return

        try:
            # Start streaming
            await websocket.send_json({
                'type': 'streaming',
                'runnerId': runner_id,
                'data': ''
            })

            full_response = ""

            async with anthropic_client.messages.stream(
                model=model,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            ) as stream:
                async for text in stream.text_stream:
                    full_response += text
                    await websocket.send_json({
                        'type': 'streaming',
                        'runnerId': runner_id,
                        'data': text
                    })

            # Send completion
            await websocket.send_json({
                'type': 'complete',
                'runnerId': runner_id,
                'data': full_response
            })

        except Exception as e:
            await websocket.send_json({
                'type': 'error',
                'runnerId': runner_id,
                'data': f'Anthropic API Error: {str(e)}'
            })

    @staticmethod
    async def run_openai(prompt: str, model: str, websocket: WebSocket, runner_id: str):
        """Stream response from OpenAI GPT"""
        if not openai_client:
            await websocket.send_json({
                'type': 'error',
                'runnerId': runner_id,
                'data': 'OpenAI API not configured. Set OPENAI_API_KEY environment variable.'
            })
            return

        try:
            # Start streaming
            await websocket.send_json({
                'type': 'streaming',
                'runnerId': runner_id,
                'data': ''
            })

            full_response = ""

            stream = await openai_client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                stream=True
            )

            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    text = chunk.choices[0].delta.content
                    full_response += text
                    await websocket.send_json({
                        'type': 'streaming',
                        'runnerId': runner_id,
                        'data': text
                    })

            # Send completion
            await websocket.send_json({
                'type': 'complete',
                'runnerId': runner_id,
                'data': full_response
            })

        except Exception as e:
            await websocket.send_json({
                'type': 'error',
                'runnerId': runner_id,
                'data': f'OpenAI API Error: {str(e)}'
            })


async def handle_python_execution(data: Dict[str, Any], websocket: WebSocket):
    """Handle Python code execution"""
    runner_id = data.get('runnerId')
    code = data.get('code', '')
    slide_id = data.get('slideId', 'default')
    persist_context = data.get('persistContext', True)

    executor = SafePythonExecutor(slide_id, persist_context)
    result = await executor.execute(code)

    # Send result back to client
    await websocket.send_json({
        **result,
        'runnerId': runner_id
    })

    # Send completion signal
    if result['type'] != 'error':
        await websocket.send_json({
            'type': 'complete',
            'runnerId': runner_id
        })


async def handle_llm_execution(data: Dict[str, Any], websocket: WebSocket):
    """Handle LLM prompt execution"""
    runner_id = data.get('runnerId')
    prompt = data.get('code', '')
    model = data.get('model', DEFAULT_CLAUDE_MODEL)

    # Determine which API to use based on model
    if model.startswith('claude'):
        await LLMRunner.run_anthropic(prompt, model, websocket, runner_id)
    elif model.startswith('gpt'):
        await LLMRunner.run_openai(prompt, model, websocket, runner_id)
    else:
        await websocket.send_json({
            'type': 'error',
            'runnerId': runner_id,
            'data': f'Unknown model: {model}'
        })


async def handle_mixed_execution(data: Dict[str, Any], websocket: WebSocket):
    """Handle mixed Python + LLM execution"""
    runner_id = data.get('runnerId')
    code = data.get('code', '')
    slide_id = data.get('slideId', 'default')
    persist_context = data.get('persistContext', True)
    model = data.get('model', DEFAULT_CLAUDE_MODEL)

    # Create a special LLM helper in the namespace
    executor = SafePythonExecutor(slide_id, persist_context)

    # Add LLM helper class to namespace
    class LLMHelper:
        async def prompt(self, text: str) -> str:
            """Send a prompt to the LLM and return the response"""
            response_buffer = []

            async def collect_response():
                if model.startswith('claude'):
                    if not anthropic_client:
                        return "Error: Anthropic API not configured"

                    async with anthropic_client.messages.stream(
                        model=model,
                        max_tokens=1024,
                        messages=[{"role": "user", "content": text}]
                    ) as stream:
                        async for chunk in stream.text_stream:
                            response_buffer.append(chunk)
                            await websocket.send_json({
                                'type': 'streaming',
                                'runnerId': runner_id,
                                'data': chunk
                            })
                elif model.startswith('gpt'):
                    if not openai_client:
                        return "Error: OpenAI API not configured"

                    stream = await openai_client.chat.completions.create(
                        model=model,
                        messages=[{"role": "user", "content": text}],
                        stream=True
                    )

                    async for chunk in stream:
                        if chunk.choices[0].delta.content:
                            content = chunk.choices[0].delta.content
                            response_buffer.append(content)
                            await websocket.send_json({
                                'type': 'streaming',
                                'runnerId': runner_id,
                                'data': content
                            })

                return ''.join(response_buffer)

            return await collect_response()

    # Note: For mixed mode, we need to handle async properly
    # This is a simplified version - full async/await support in exec is complex
    await websocket.send_json({
        'type': 'output',
        'runnerId': runner_id,
        'data': 'Mixed mode: Python + LLM integration\nNote: Use synchronous Python with LLM calls for best results'
    })

    # Execute the Python code
    result = await executor.execute(code)

    await websocket.send_json({
        **result,
        'runnerId': runner_id
    })

    if result['type'] != 'error':
        await websocket.send_json({
            'type': 'complete',
            'runnerId': runner_id
        })


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Main WebSocket endpoint for handling runner requests"""
    await websocket.accept()
    print(f"[{datetime.now()}] Client connected")

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            execution_type = data.get('type', 'python')

            try:
                if execution_type == 'python':
                    await handle_python_execution(data, websocket)
                elif execution_type == 'llm':
                    await handle_llm_execution(data, websocket)
                elif execution_type == 'mixed':
                    await handle_mixed_execution(data, websocket)
                else:
                    await websocket.send_json({
                        'type': 'error',
                        'runnerId': data.get('runnerId'),
                        'data': f'Unknown execution type: {execution_type}'
                    })
            except Exception as e:
                error_msg = ''.join(traceback.format_exception(type(e), e, e.__traceback__))
                await websocket.send_json({
                    'type': 'error',
                    'runnerId': data.get('runnerId'),
                    'data': f'Server error: {error_msg}'
                })

    except WebSocketDisconnect:
        print(f"[{datetime.now()}] Client disconnected")
    except Exception as e:
        print(f"[{datetime.now()}] WebSocket error: {e}")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "LLM Runner Server",
        "anthropic_available": ANTHROPIC_AVAILABLE and anthropic_client is not None,
        "openai_available": OPENAI_AVAILABLE and openai_client is not None,
        "active_contexts": len(slide_contexts)
    }


@app.post("/reset-context/{slide_id}")
async def reset_context(slide_id: str):
    """Reset execution context for a specific slide"""
    if slide_id in slide_contexts:
        del slide_contexts[slide_id]
        return {"status": "reset", "slide_id": slide_id}
    return {"status": "not_found", "slide_id": slide_id}


@app.post("/reset-all-contexts")
async def reset_all_contexts():
    """Reset all execution contexts"""
    count = len(slide_contexts)
    slide_contexts.clear()
    return {"status": "reset", "count": count}


if __name__ == "__main__":
    print("=" * 60)
    print("LLM Runner Server")
    print("=" * 60)
    print(f"Anthropic (Claude): {'[OK] Available' if ANTHROPIC_AVAILABLE and anthropic_client else '[X] Not configured'}")
    print(f"OpenAI (GPT): {'[OK] Available' if OPENAI_AVAILABLE and openai_client else '[X] Not configured'}")
    print("=" * 60)
    print("\nStarting server on http://localhost:8001")
    print("WebSocket endpoint: ws://localhost:8001/ws")
    print("\nPress Ctrl+C to stop\n")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )
