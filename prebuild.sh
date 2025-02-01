#!/bin/bash

# Create necessary directories
mkdir -p build/ios/Jetset

# Copy GoogleService-Info.plist to the required location
cp ios/Jetset/GoogleService-Info.plist build/ios/Jetset/

# Make sure the file exists in the target location
if [ ! -f "build/ios/Jetset/GoogleService-Info.plist" ]; then
    echo "Error: GoogleService-Info.plist not copied successfully"
    exit 1
fi

echo "GoogleService-Info.plist copied successfully" 