#!/bin/bash

# 原型展示平台启动脚本
# 适用于 macOS 和 Linux 系统

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 清屏
clear

echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    原型展示平台                                ║"
echo "║                 Prototype Showcase Platform                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 检查 Node.js 是否安装
echo -e "${CYAN}🔍 检查系统环境...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到 Node.js${NC}"
    echo -e "${YELLOW}请先安装 Node.js (版本 12 或更高)${NC}"
    echo -e "${BLUE}下载地址: https://nodejs.org/${NC}"
    exit 1
fi

# 显示 Node.js 版本
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js 版本: $NODE_VERSION${NC}"

# 检查端口是否被占用
PORT=3000
echo -e "${CYAN}🔍 检查端口 $PORT...${NC}"

if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  端口 $PORT 已被占用${NC}"
    echo -e "${BLUE}正在尝试终止占用端口的进程...${NC}"
    
    # 尝试终止占用端口的进程
    kill -9 $(lsof -t -i:$PORT) 2>/dev/null || true
    
    sleep 2
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ 无法释放端口 $PORT，请手动处理${NC}"
        echo -e "${YELLOW}或者修改 serve.js 中的端口号${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ 端口已释放${NC}"
    fi
else
    echo -e "${GREEN}✅ 端口 $PORT 可用${NC}"
fi

echo

# 显示系统信息
echo -e "${CYAN}📋 系统信息:${NC}"
echo -e "   操作系统: $(uname -s)"
echo -e "   架构:     $(uname -m)"
echo -e "   Node.js:  $NODE_VERSION"
echo -e "   工作目录: $(pwd)"
echo

# 显示项目信息
echo -e "${CYAN}📦 可用的原型项目:${NC}"
echo -e "   📱 点当餐厅 - 餐厅管理系统"
echo -e "      ├─ 小程序端: /diandang/miniprogram/"
echo -e "      └─ 商家后台: /diandang/merchant/"
echo -e "   🛒 Mall商城 - 电商购物系统"
echo -e "      ├─ 小程序端: /mall/miniprogram/"
echo -e "      └─ 管理后台: /mall/admin/"
echo

# 检查服务是否已经在运行
PID_FILE="./server.pid"
LOG_FILE="./server.log"

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  服务器已在运行中 (PID: $PID)${NC}"
        echo -e "${BLUE}如需重启服务器，请先运行 ./stop.sh${NC}"
        exit 1
    else
        # PID文件存在但进程不存在，清理PID文件
        rm -f "$PID_FILE"
    fi
fi

# 启动服务器
echo -e "${GREEN}🚀 正在启动原型展示平台服务器...${NC}"
echo

# 延迟1秒后启动
sleep 1

# 启动 Node.js 服务器到后台
nohup node serve.js > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

# 保存PID到文件
echo $SERVER_PID > "$PID_FILE"

echo -e "${GREEN}✅ 服务器已启动 (PID: $SERVER_PID)${NC}"
echo -e "${CYAN}📋 服务器信息:${NC}"
echo -e "   进程ID: $SERVER_PID"
echo -e "   日志文件: $LOG_FILE"
echo -e "   PID文件: $PID_FILE"
echo
echo -e "${BLUE}💡 管理命令:${NC}"
echo -e "   查看状态: ./status.sh"
echo -e "   查看日志: tail -f $LOG_FILE"
echo -e "   停止服务: ./stop.sh"
echo -e "   重启服务: ./stop.sh && ./start.sh"
echo