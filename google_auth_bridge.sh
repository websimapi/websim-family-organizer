#!/bin/bash
# Google Auth Bridge launcher
# This script installs required dependencies and launches the Python bridge

echo "Setting up Family Organizer Google Auth Bridge..."

# Create a virtual environment
echo "Creating Python virtual environment..."
python3 -m venv .venv

# Activate the virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install required Python packages
echo "Installing required Python packages..."
pip install websockets

# Run the Python bridge
echo "Starting Google Auth Bridge..."
python google_auth_bridge.py


