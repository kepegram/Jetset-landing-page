#!/bin/bash

# Create necessary directories
mkdir -p ios/Jetset

# Check if the file exists in the source location
if [ -f "ios/Jetset/GoogleService-Info.plist" ]; then
    echo "Found GoogleService-Info.plist"
else
    echo "Error: GoogleService-Info.plist not found in ios/Jetset/"
    exit 1
fi

echo "GoogleService-Info.plist setup completed successfully" 