#!/bin/bash

# 原型展示平台停止脚本
# 适用于 macOS 和 Linux 系统

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    停止原型展示平台                            ║"
echo "║                Stop Prototype Showcase Platform               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

PID_FILE="./server.pid"
LOG_FILE="./server.log"

# 检查PID文件是否存在
if [ ! -f "$PID_FILE" ]; then
    echo -e "${YELLOW}⚠️  未找到服务器进程文件${NC}"
    echo -e "${BLUE}服务器可能未启动或已停止${NC}"
    
    # 尝试查找正在运行的node serve.js进程
    echo -e "${CYAN}🔍 搜索正在运行的服务器进程...${NC}"
    RUNNING_PIDS=$(pgrep -f "node serve.js")
    
    if [ -n "$RUNNING_PIDS" ]; then
        echo -e "${YELLOW}发现运行中的服务器进程:${NC}"
        for pid in $RUNNING_PIDS; do
            echo -e "   PID: $pid"
        done
        echo
        read -p "是否要停止这些进程? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            for pid in $RUNNING_PIDS; do
                echo -e "${BLUE}正在停止进程 $pid...${NC}"
                kill $pid 2>/dev/null
                sleep 1
                # 如果进程仍在运行，强制杀死
                if ps -p $pid > /dev/null 2>&1; then
                    echo -e "${YELLOW}强制停止进程 $pid${NC}"
                    kill -9 $pid 2>/dev/null
                fi
            done
            echo -e "${GREEN}✅ 所有服务器进程已停止${NC}"
        else
            echo -e "${BLUE}取消操作${NC}"
        fi
    else
        echo -e "${GREEN}✅ 未发现运行中的服务器进程${NC}"
    fi
    exit 0
fi

# 读取PID
PID=$(cat "$PID_FILE")

echo -e "${CYAN}🔍 检查服务器进程 (PID: $PID)...${NC}"

# 检查进程是否存在
if ! ps -p $PID > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  进程 $PID 不存在${NC}"
    echo -e "${BLUE}清理PID文件...${NC}"
    rm -f "$PID_FILE"
    echo -e "${GREEN}✅ 清理完成${NC}"
    exit 0
fi

echo -e "${BLUE}🛑 正在停止服务器进程 $PID...${NC}"

# 尝试优雅停止
kill $PID 2>/dev/null

# 等待进程结束
for i in {1..10}; do
    if ! ps -p $PID > /dev/null 2>&1; then
        break
    fi
    echo -e "${CYAN}等待进程结束... ($i/10)${NC}"
    sleep 1
done

# 检查进程是否已停止
if ps -p $PID > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  进程未响应，强制停止...${NC}"
    kill -9 $PID 2>/dev/null
    sleep 1
fi

# 再次检查
if ps -p $PID > /dev/null 2>&1; then
    echo -e "${RED}❌ 无法停止进程 $PID${NC}"
    exit 1
else
    echo -e "${GREEN}✅ 服务器已停止${NC}"
fi

# 清理文件
echo -e "${BLUE}🧹 清理临时文件...${NC}"
rm -f "$PID_FILE"

# 询问是否清理日志文件
if [ -f "$LOG_FILE" ]; then
    LOG_SIZE=$(du -h "$LOG_FILE" | cut -f1)
    echo -e "${CYAN}📄 日志文件: $LOG_FILE (大小: $LOG_SIZE)${NC}"
    read -p "是否要清理日志文件? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f "$LOG_FILE"
        echo -e "${GREEN}✅ 日志文件已清理${NC}"
    else
        echo -e "${BLUE}保留日志文件: $LOG_FILE${NC}"
    fi
fi

echo
echo -e "${GREEN}🎉 原型展示平台已完全停止${NC}"
echo -e "${BLUE}如需重新启动，请运行: ./start.sh${NC}"
echo -e "${CYAN}查看服务状态，请运行: ./status.sh${NC}"