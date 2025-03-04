#!/usr/bin/env python3
# Google Auth Bridge for Family Organizer
# Run this script on a Raspberry Pi to enable Google authentication

import asyncio
import json
import sys
import os
import webbrowser
import urllib.parse
import websockets
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time

# Configuration
API_KEY = os.environ.get('GOOGLE_API_KEY')
CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID') or '864838475869-jrg1s2odt5pq3lkapj5fmmfv8u0laiem.apps.googleusercontent.com'

# Ask for API keys if not provided
if not API_KEY:
    API_KEY = input("Enter your Google API Key: ")

print("Starting Google Auth Bridge for Family Organizer...")
print("API Key:", API_KEY[:5] + "..." if API_KEY else "Not provided")
print("Client ID:", CLIENT_ID[:10] + "..." if CLIENT_ID else "Not provided")

# Store the current web socket connection
current_websocket = None
auth_data = None

# Web socket server to communicate with the web app
async def auth_bridge(websocket):
    global current_websocket
    current_websocket = websocket
    print("Web client connected")
    
    try:
        # Send connection confirmation
        await websocket.send(json.dumps({"status": "connected", "message": "Bridge connected successfully"}))
        
        # Wait for auth request from the web app
        async for message in websocket:
            try:
                data = json.loads(message)
                if data.get('action') == 'initiate_auth':
                    # Open browser with Google auth URL
                    print("Opening browser for authentication...")
                    auth_url = (
                        f"https://accounts.google.com/o/oauth2/auth"
                        f"?client_id={CLIENT_ID}"
                        f"&redirect_uri=http://localhost:8000/callback"
                        f"&scope={urllib.parse.quote('https://www.googleapis.com/auth/calendar')}"
                        f"&response_type=code"
                        f"&access_type=offline"
                    )
                    webbrowser.open(auth_url)
            except json.JSONDecodeError:
                print("Received invalid JSON message")
        
        # Keep connection alive until closed
        while True:
            await asyncio.sleep(1)
    except websockets.exceptions.ConnectionClosed:
        print("Web client disconnected")
        current_websocket = None

# HTTP server to handle OAuth callback
class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global current_websocket, auth_data
        
        if self.path.startswith('/callback'):
            print("Received OAuth callback")
            
            # Parse the query parameters
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            
            # Get the authorization code
            code = params.get('code', [''])[0]
            
            if code:
                # Store the auth data
                auth_data = {"code": code}
                
                # Send back to web app if connected
                if current_websocket:
                    asyncio.run_coroutine_threadsafe(
                        current_websocket.send(json.dumps({
                            "status": "success",
                            "auth_code": code
                        })),
                        asyncio.get_event_loop()
                    )
            
            # Display success message to user
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            self.wfile.write(b"""
                <html>
                <head>
                    <title>Authentication Successful</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #4285F4; }
                        p { margin: 20px 0; }
                        .success { color: #34A853; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>Authentication Successful</h1>
                    <p class="success">You have successfully authenticated with Google.</p>
                    <p>You can close this window and return to the Family Organizer app.</p>
                    <script>
                        // Send message to main window if it opened this one
                        if (window.opener) {
                            window.opener.postMessage({
                                type: 'auth_success',
                                code: """ + f"'{code}'" + """
                            }, '*');
                            setTimeout(function() {
                                window.close();
                            }, 2000);
                        }
                    </script>
                </body>
                </html>
            """)

# Start both servers
async def main():
    # Start websocket server
    ws_server = await websockets.serve(auth_bridge, "localhost", 8765)
    
    # Start HTTP server for OAuth callback
    http_server = HTTPServer(('localhost', 8000), CallbackHandler)
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