#!/bin/bash
# Google Auth Bridge launcher
# This script installs required dependencies and launches the Python bridge

echo "Setting up Family Organizer Google Auth Bridge..."

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "Python pip is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y python3-pip
fi

# Install required Python packages
echo "Installing required Python packages..."
pip3 install websockets

# Run the Python bridge
echo "Starting Google Auth Bridge..."
python3 google_auth_bridge.py

