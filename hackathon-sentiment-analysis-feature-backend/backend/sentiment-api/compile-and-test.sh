#!/bin/bash

# Script: Compile and test Sentiment API
# Author: Backend Team
# Date: 2025-01-03

echo "============================================"
echo "SENTIMENT API - COMPILE AND TEST"
echo "============================================"
echo ""

# Create logs directory
mkdir -p logs

# Set log file with timestamp
LOG_FILE="logs/compile-$(date +%Y%m%d-%H%M%S).log"

echo "Log file: $LOG_FILE"
echo ""

# Step 1: Clean previous builds
echo "[1/4] Cleaning previous builds..."
mvn clean 2>&1 | tee -a "$LOG_FILE"

if [ $? -eq 0 ]; then
    echo "✓ Clean successful"
else
    echo "✗ Clean failed"
    exit 1
fi

echo ""

# Step 2: Compile the project
echo "[2/4] Compiling project..."
mvn compile 2>&1 | tee -a "$LOG_FILE"

if [ $? -eq 0 ]; then
    echo "✓ Compilation successful"
else
    echo "✗ Compilation failed - Check logs: $LOG_FILE"
    echo ""
    echo "Common errors:"
    grep -i "error" "$LOG_FILE" | head -5
    exit 1
fi

echo ""

# Step 3: Run tests (if any)
echo "[3/4] Running tests..."
mvn test 2>&1 | tee -a "$LOG_FILE"

if [ $? -eq 0 ]; then
    echo "✓ Tests passed"
else
    echo "⚠ Tests failed or no tests found"
fi

echo ""

# Step 4: Package the application
echo "[4/4] Packaging application..."
mvn package -DskipTests 2>&1 | tee -a "$LOG_FILE"

if [ $? -eq 0 ]; then
    echo "✓ Package successful"
else
    echo "✗ Package failed"
    exit 1
fi

echo ""
echo "============================================"
echo "COMPILATION SUMMARY"
echo "============================================"
echo "Status: SUCCESS"
echo "Log file: $LOG_FILE"
echo ""
echo "To run the application:"
echo "  mvn spring-boot:run"
echo ""
echo "To view logs:"
echo "  cat $LOG_FILE"
echo ""
echo "To search for errors:"
echo "  grep -i error $LOG_FILE"
echo "============================================"
