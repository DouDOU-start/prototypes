#!/bin/bash

# 原型展示平台状态查询脚本
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
echo "║                  原型展示平台 - 服务状态                        ║"
echo "║              Prototype Showcase - Service Status              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

PID_FILE="./server.pid"
LOG_FILE="./server.log"
PORT=3000

# 检查PID文件
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    echo -e "${CYAN}📋 PID文件信息:${NC}"
    echo -e "   文件路径: $PID_FILE"
    echo -e "   进程ID:   $PID"
    echo
    
    # 检查进程是否存在
    if ps -p $PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 服务器状态: 正在运行${NC}"
        
        # 获取进程详细信息
        echo -e "${CYAN}🔍 进程详情:${NC}"
        ps -p $PID -o pid,ppid,cmd,etime,pcpu,pmem --no-headers | while read line; do
            echo -e "   $line"
        done
        echo
        
        # 检查端口状态
        echo -e "${CYAN}🌐 端口状态:${NC}"
        if netstat -tlnp 2>/dev/null | grep ":$PORT " | grep -q "$PID"; then
            echo -e "   ${GREEN}✅ 端口 $PORT 正在监听${NC}"
            netstat -tlnp 2>/dev/null | grep ":$PORT " | while read line; do
                echo -e "   $line"
            done
        elif lsof -i :$PORT -t >/dev/null 2>&1; then
            echo -e "   ${YELLOW}⚠️  端口 $PORT 被其他进程占用${NC}"
            lsof -i :$PORT 2>/dev/null | while read line; do
                echo -e "   $line"
            done
        else
            echo -e "   ${RED}❌ 端口 $PORT 未在监听${NC}"
        fi
        echo
        
        # 内存和CPU使用情况
        echo -e "${CYAN}📊 资源使用:${NC}"
        ps -p $PID -o pid,pcpu,pmem,vsz,rss --no-headers | while read pid cpu mem vsz rss; do
            echo -e "   CPU使用率: ${cpu}%"
            echo -e "   内存使用率: ${mem}%"
            echo -e "   虚拟内存: ${vsz} KB"
            echo -e "   物理内存: ${rss} KB"
        done
        echo
        
        # 运行时长
        echo -e "${CYAN}⏱️  运行时长:${NC}"
        ps -p $PID -o etime --no-headers | while read etime; do
            echo -e "   已运行: $etime"
        done
        echo
        
    else
        echo -e "${RED}❌ 服务器状态: 未运行${NC}"
        echo -e "${YELLOW}⚠️  PID文件存在但进程不存在，可能异常退出${NC}"
        echo
    fi
else
    echo -e "${YELLOW}⚠️  未找到PID文件${NC}"
    echo -e "${BLUE}服务器可能未启动或未使用 ./start.sh 启动${NC}"
    echo
    
    # 搜索可能的node进程
    echo -e "${CYAN}🔍 搜索相关进程:${NC}"
    FOUND_PROCESSES=$(pgrep -f "node serve.js" 2>/dev/null)
    if [ -n "$FOUND_PROCESSES" ]; then
        echo -e "${YELLOW}发现可能相关的进程:${NC}"
        for pid in $FOUND_PROCESSES; do
            ps -p $pid -o pid,cmd,etime --no-headers | while read line; do
                echo -e "   $line"
            done
        done
    else
        echo -e "${BLUE}未发现 node serve.js 进程${NC}"
    fi
    echo
fi

# 检查日志文件
if [ -f "$LOG_FILE" ]; then
    LOG_SIZE=$(du -h "$LOG_FILE" | cut -f1)
    LOG_LINES=$(wc -l < "$LOG_FILE")
    LOG_MODIFIED=$(stat -c %y "$LOG_FILE" 2>/dev/null || stat -f %Sm "$LOG_FILE" 2>/dev/null)
    
    echo -e "${CYAN}📄 日志文件信息:${NC}"
    echo -e "   文件路径: $LOG_FILE"
    echo -e "   文件大小: $LOG_SIZE"
    echo -e "   行数:     $LOG_LINES"
    echo -e "   最后修改: $LOG_MODIFIED"
    echo
    
    if [ $LOG_LINES -gt 0 ]; then
        echo -e "${CYAN}📝 最近日志 (最后10行):${NC}"
        echo -e "${BLUE}────────────────────────────────────────${NC}"
        tail -10 "$LOG_FILE" | while read line; do
            echo -e "   $line"
        done
        echo -e "${BLUE}────────────────────────────────────────${NC}"
    else
        echo -e "${YELLOW}⚠️  日志文件为空${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  未找到日志文件: $LOG_FILE${NC}"
fi

echo

# 检查端口占用情况
echo -e "${CYAN}🌐 端口 $PORT 占用情况:${NC}"
if command -v lsof >/dev/null 2>&1; then
    PORT_INFO=$(lsof -i :$PORT 2>/dev/null)
    if [ -n "$PORT_INFO" ]; then
        echo -e "${GREEN}端口 $PORT 正被使用:${NC}"
        echo "$PORT_INFO" | while read line; do
            echo -e "   $line"
        done
    else
        echo -e "${BLUE}端口 $PORT 当前未被占用${NC}"
    fi
elif command -v netstat >/dev/null 2>&1; then
    PORT_INFO=$(netstat -tlnp 2>/dev/null | grep ":$PORT ")
    if [ -n "$PORT_INFO" ]; then
        echo -e "${GREEN}端口 $PORT 正被使用:${NC}"
        echo "$PORT_INFO" | while read line; do
            echo -e "   $line"
        done
    else
        echo -e "${BLUE}端口 $PORT 当前未被占用${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  无法检查端口状态 (需要 lsof 或 netstat)${NC}"
fi

echo

# 显示管理命令
echo -e "${BLUE}💡 管理命令:${NC}"
if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
    echo -e "   停止服务: ${GREEN}./stop.sh${NC}"
    echo -e "   重启服务: ${GREEN}./stop.sh && ./start.sh${NC}"
    echo -e "   实时日志: ${GREEN}tail -f $LOG_FILE${NC}"
else
    echo -e "   启动服务: ${GREEN}./start.sh${NC}"
    if [ -f "$LOG_FILE" ]; then
        echo -e "   查看日志: ${GREEN}cat $LOG_FILE${NC}"
    fi
fi
echo -e "   服务状态: ${GREEN}./status.sh${NC}"

echo

# 访问地址
echo -e "${CYAN}🌍 服务访问地址:${NC}"
if [ -f "$PID_FILE" ] && ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
    echo -e "   ${GREEN}本地访问: http://localhost:$PORT${NC}"
    echo -e "   ${GREEN}公网访问: http://106.12.5.203:$PORT${NC}"
else
    echo -e "   ${YELLOW}服务未运行，请先启动服务${NC}"
fi