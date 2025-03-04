#!/usr/bin/env python3
# Google Auth Bridge for Family Organizer
# Run this script on a Raspberry Pi to enable Google authentication

import asyncio
import json
import sys
import os
import websockets
from http.server import HTTPServer, BaseHTTPRequestHandler

# Configuration
API_KEY = os.environ.get('GOOGLE_API_KEY')
CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')

# Ask for API keys if not provided
if not API_KEY:
    API_KEY = input("Enter your Google API Key: ")
if not CLIENT_ID:
    CLIENT_ID = input("Enter your Google Client ID: ")

print("Starting Google Auth Bridge for Family Organizer...")
print("API Key:", API_KEY[:5] + "..." if API_KEY else "Not provided")
print("Client ID:", CLIENT_ID[:10] + "..." if CLIENT_ID else "Not provided")

# Web socket server to communicate with the web app
async def auth_bridge(websocket, path):
    print("Web client connected")
    # The bridge now just confirms connectivity but doesn't trigger auth flow
    # Authentication happens directly in the browser
    await websocket.send(json.dumps({"status": "connected", "message": "Bridge connected successfully"}))

# HTTP server to handle OAuth callback
class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/callback'):
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            # Display success message to user
            self.wfile.write(b"""
                <html>
                <body>
                    <h1>Bridge Connected</h1>
                    <p>You can close this window and return to the Family Organizer app.</p>
                </body>
                </html>
            """)

# Start both servers
async def main():
    # Start websocket server
    ws_server = await websockets.serve(auth_bridge, "localhost", 8765)
    
    # Start HTTP server for OAuth callback
    http_server = HTTPServer(('localhost', 8000), CallbackHandler)
    import threading
    threading.Thread(target=http_server.serve_forever, daemon=True).start()
    
    print("Bridge servers started!")
    print("WebSocket server running on ws://localhost:8765")
    print("HTTP callback server running on http://localhost:8000")
    
    # Keep the server running
    await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Bridge servers stopped.")
        sys.exit(0)