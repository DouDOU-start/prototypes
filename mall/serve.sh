#!/usr/bin/env bash
set -euo pipefail

# Simple local server for GuitarMall
# - Serves project root as static site
# - Maps /miniprogram to ./miniprogram
# - Maps /admin to ./app via symlink
# Usage: ./serve.sh [port]

PORT="${1:-${PORT:-5173}}"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# Create symlink for /admin -> ./app if not present
if [ ! -e "admin" ]; then
  ln -s "app" "admin"
fi

# Info output
cat <<EOF
────────────────────────────────────────────
GuitarMall 本地静态服务器已启动
Root: $ROOT_DIR
Port: $PORT

访问地址：
- 小程序端:    http://localhost:$PORT/miniprogram/
- 商家管理端:  http://localhost:$PORT/admin/
────────────────────────────────────────────
EOF

# Try python3, fallback to python
if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  exec python -m http.server "$PORT"
else
  echo "未检测到 Python，请安装 Python 或改用 Node/Express 启动。" >&2
  exit 1
fi 