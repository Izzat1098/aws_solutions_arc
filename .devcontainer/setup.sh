#!/usr/bin/env bash
set -euo pipefail
cd /workspaces

echo "================================"
echo "Codespace Setup Script"
echo "================================"

# Update package manager
echo "📦 Updating package manager..."
sudo apt-get update
# apt-get install -y -qq unzip curl wget git build-essential

echo "AWS CLI installation..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
# rm -rf awscliv2.zip aws
cd $OLDPWD

echo "✅ Verifying AWS CLI installation..."
aws --version

# Install AWS CLI autocomplete for bash
echo "🔧 Setting up AWS CLI autocomplete..."
complete -C '$(which aws_completer)' aws
export AWS_CLI_AUTO_PROMPT=on-partial

echo ""
echo "================================"
echo "✨ Setup Complete!"
echo "================================"
echo "AWS CLI version: $(aws --version)"
# echo "Python version: $(python3 --version)"
# echo "Node.js version: $(node --version)"
# echo "npm version: $(npm --version)"
echo ""
echo "📝 Next steps:"
echo "   1. Run: aws configure"
echo "   2. Enter your AWS credentials"
echo "   3. Start using AWS CLI!"
echo "================================"
