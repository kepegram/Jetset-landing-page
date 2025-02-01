#!/bin/bash

# Create necessary directories
mkdir -p ios/Jetset

# Check if we have the base64 encoded secret
if [ -n "$GOOGLE_SERVICES_BASE64" ]; then
    echo "Using GOOGLE_SERVICES_BASE64 secret"
    echo "$GOOGLE_SERVICES_BASE64" | base64 -d > ios/Jetset/GoogleService-Info.plist
    if [ $? -eq 0 ]; then
        echo "Successfully decoded and saved GoogleService-Info.plist"
    else
        echo "Error: Failed to decode GOOGLE_SERVICES_BASE64"
        exit 1
    fi
else
    echo "Error: GOOGLE_SERVICES_BASE64 environment variable not found"
    exit 1
fi

echo "GoogleService-Info.plist setup completed successfully" 