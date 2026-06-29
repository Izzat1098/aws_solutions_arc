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
sudo apt-get install -y python-is-python
# use UV for dependency and venv management
curl -LsSf https://astral.sh/uv/install.sh | sh
cd $OLDPWD

echo "✅ Verifying Python installation..."
python --version
# pip --version

echo ""
echo "================================"
echo "✨ Setup Complete!"
echo "================================"
echo "Python version: $(python --version)"