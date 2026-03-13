#!/usr/bin/env python3
"""
简单的HTTP服务器，用于运行竖屏太空射击游戏
"""

import http.server
import socketserver
import os
import webbrowser
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def log_message(self, format, *args):
        # 自定义日志格式
        print(f"[HTTP] {self.address_string()} - {format % args}")

def main():
    os.chdir(DIRECTORY)
    
    print("=" * 50)
    print("  竖屏太空射击游戏 - HTTP服务器")
    print("=" * 50)
    print(f"游戏目录: {DIRECTORY}")
    print(f"服务器运行在: http://localhost:{PORT}")
    print(f"游戏地址: http://localhost:{PORT}/index.html")
    print("\n游戏特点:")
    print("  • 竖屏显示模式 (720x1280)")
    print("  • 鼠标控制飞机自由移动")
    print("  • 多种敌机类型")
    print("  • 粒子爆炸效果")
    print("\n操作说明:")
    print("  • 移动鼠标 - 控制飞机飞行")
    print("  • 左键点击 - 发射子弹")
    print("  • 空格键 - 发射子弹")
    print("  • F键 - 切换全屏模式")
    print("  • ESC键 - 暂停游戏")
    print("=" * 50)
    
    try:
        # 尝试打开浏览器
        print("\n正在打开浏览器...")
        webbrowser.open(f'http://localhost:{PORT}/index.html')
    except:
        print("无法自动打开浏览器，请手动访问上面的地址")
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"\n服务器已启动，按 Ctrl+C 停止")
            print("正在等待连接...\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n服务器已停止")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # 端口被占用
            print(f"\n错误: 端口 {PORT} 已被占用")
            print("请尝试:")
            print(f"  1. 关闭占用端口 {PORT} 的程序")
            print(f"  2. 使用其他端口: python3 server.py 8081")
            sys.exit(1)
        else:
            raise

if __name__ == "__main__":
    # 检查端口参数
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print(f"错误: 无效的端口号 '{sys.argv[1]}'")
            print("用法: python3 server.py [端口号]")
            sys.exit(1)
    
    main()