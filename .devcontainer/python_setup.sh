#!/usr/bin/env bash
set -euo pipefail
cd /workspaces

echo "================================"
echo "Python Setup Script"
echo "================================"

# Update package manager
echo "📦 Updating package manager..."
sudo apt-get update
# apt-get install -y -qq unzip curl wget git build-essential

echo "Python installation..."
sudo apt-get install -y python-is-python3 python3-pip
cd $OLDPWD

echo "✅ Verifying Python installation..."
python --version
pip --version
pip install boto3
echo ""
echo "================================"
echo "✨ Setup Complete!"
echo "================================"
echo "Python version: $(python --version)"