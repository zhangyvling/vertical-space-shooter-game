// 竖屏太空射击游戏 - 鼠标控制版
// 基于原版太空射击游戏修改

// 游戏变量
let canvas, ctx;
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 3;
let level = 1;
let mouseX = 0;
let mouseY = 0;
let isMouseInCanvas = false;

// 游戏对象
let player = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    speed: 8,
    color: '#4ecdc4',
    trail: [],
    maxTrail: 15
};

let bullets = [];
let enemies = [];
let particles = [];

// 游戏常量
const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 1280;
const BULLET_SPEED = 12;
const ENEMY_SPEED_MIN = 2;
const ENEMY_SPEED_MAX = 6;
const ENEMY_SPAWN_RATE = 60; // 每60帧生成一个敌机
const LEVEL_UP_SCORE = 1000;

// 敌机类型
const ENEMY_TYPES = [
    { color: '#ff6b6b', speed: 3, behavior: 'straight', points: 100 },    // 红色 - 直线移动
    { color: '#4ecdc4', speed: 2, behavior: 'chase', points: 150 },       // 蓝色 - 追踪玩家
    { color: '#ffe66d', speed: 5, behavior: 'straight', points: 200 },    // 黄色 - 快速移动
    { color: '#ff8e53', speed: 2, behavior: 'shooter', points: 250 }      // 橙色 - 发射子弹
];

// 初始化游戏
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // 设置画布尺寸（竖屏）
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // 初始化玩家位置（屏幕中央）
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    
    // 清空游戏对象
    bullets = [];
    enemies = [];
    particles = [];
    player.trail = [];
    
    // 重置游戏状态
    score = 0;
    lives = 3;
    level = 1;
    
    // 更新UI
    updateUI();
    
    // 显示鼠标指示器
    document.getElementById('mouseIndicator').style.display = 'block';
    
    console.log('游戏初始化完成 - 竖屏模式:', canvas.width, 'x', canvas.height);
}

// 更新UI显示
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('level').textContent = level;
    document.getElementById('resolution').textContent = `${canvas.width}x${canvas.height} (竖屏)`;
}

// 游戏主循环
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制星空背景
    drawBackground();
    
    // 更新和绘制游戏对象
    updatePlayer();
    updateBullets();
    updateEnemies();
    updateParticles();
    
    // 检测碰撞
    checkCollisions();
    
    // 生成敌机
    if (Math.random() * ENEMY_SPAWN_RATE < 1) {
        spawnEnemy();
    }
    
    // 更新鼠标指示器位置
    updateMouseIndicator();
    
    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 绘制星空背景
function drawBackground() {
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000428');
    gradient.addColorStop(1, '#004e92');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制星星
    for (let i = 0; i < 100; i++) {
        const x = (i * 7.3) % canvas.width;
        const y = (i * 4.7) % canvas.height;
        const size = Math.sin(Date.now() * 0.001 + i) * 1.5 + 1.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(Date.now() * 0.002 + i) * 0.3})`;
        ctx.fill();
    }
}

// 更新玩家（鼠标控制）
function updatePlayer() {
    // 平滑移动到鼠标位置
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 添加轨迹点
    player.trail.push({ x: player.x, y: player.y });
    if (player.trail.length > player.maxTrail) {
        player.trail.shift();
    }
    
    // 平滑移动
    if (distance > 0) {
        if (distance > player.speed) {
            player.x += dx * player.speed / distance;
            player.y += dy * player.speed / distance;
        } else {
            player.x = mouseX;
            player.y = mouseY;
        }
    }
    
    // 确保玩家在屏幕内
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
    player.y = Math.max(player.height / 2, Math.min(canvas.height - player.height / 2, player.y));
    
    // 绘制轨迹
    drawPlayerTrail();
    
    // 绘制玩家飞机
    drawPlayer();
}

// 绘制玩家轨迹
function drawPlayerTrail() {
    for (let i = 0; i < player.trail.length; i++) {
        const point = player.trail[i];
        const alpha = i / player.trail.length;
        const size = player.width * 0.4 * alpha;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(78, 205, 196, ${alpha * 0.5})`;
        ctx.fill();
    }
}

// 绘制玩家飞机
function drawPlayer() {
    // 绘制飞机主体
    ctx.save();
    ctx.translate(player.x, player.y);
    
    // 计算飞机朝向（指向鼠标）
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    ctx.rotate(angle);
    
    // 飞机主体（三角形）
    ctx.beginPath();
    ctx.moveTo(player.width / 2, 0);
    ctx.lineTo(-player.width / 2, -player.height / 3);
    ctx.lineTo(-player.width / 2, player.height / 3);
    ctx.closePath();
    
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 飞机机翼
    ctx.beginPath();
    ctx.moveTo(-player.width / 4, -player.height / 3);
    ctx.lineTo(-player.width / 4, -player.height / 2);
    ctx.moveTo(-player.width / 4, player.height / 3);
    ctx.lineTo(-player.width / 4, player.height / 2);
    ctx.stroke();
    
    // 飞机尾翼
    ctx.beginPath();
    ctx.moveTo(-player.width / 2, 0);
    ctx.lineTo(-player.width / 1.5, 0);
    ctx.stroke();
    
    // 驾驶舱
    ctx.beginPath();
    ctx.arc(player.width / 4, 0, player.width / 6, 0, Math.PI * 2);
    ctx.fillStyle = '#87ceeb';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    
    ctx.restore();
}

// 更新子弹
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // 更新位置
        bullet.y -= bullet.speed;
        
        // 移除超出屏幕的子弹
        if (bullet.y < -10) {
            bullets.splice(i, 1);
            continue;
        }
        
        // 绘制子弹
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        
        // 子弹尾迹
        ctx.beginPath();
        ctx.moveTo(bullet.x, bullet.y);
        ctx.lineTo(bullet.x, bullet.y + 10);
        ctx.strokeStyle = bullet.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// 生成敌机
function spawnEnemy() {
    const typeIndex = Math.floor(Math.random() * ENEMY_TYPES.length);
    const enemyType = ENEMY_TYPES[typeIndex];
    
    const enemy = {
        x: Math.random() * (canvas.width - 40) + 20,
        y: -40,
        width: 35,
        height: 35,
        speed: enemyType.speed + Math.random() * 2,
        color: enemyType.color,
        type: enemyType.behavior,
        points: enemyType.points,
        shootCooldown: 0
    };
    
    enemies.push(enemy);
}

// 更新敌机
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        // 根据类型更新行为
        switch (enemy.type) {
            case 'straight':
                // 直线向下移动
                enemy.y += enemy.speed;
                break;
                
            case 'chase':
                // 追踪玩家
                const dx = player.x - enemy.x;
                const dy = player.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    enemy.x += (dx / distance) * enemy.speed * 0.5;
                    enemy.y += enemy.speed; // 仍然向下移动
                }
                break;
                
            case 'shooter':
                // 向下移动并射击
                enemy.y += enemy.speed;
                
                // 射击冷却
                if (enemy.shootCooldown <= 0 && enemy.y > 100) {
                    shootEnemyBullet(enemy);
                    enemy.shootCooldown = 60 + Math.random() * 60;
                } else {
                    enemy.shootCooldown--;
                }
                break;
        }
        
        // 移除超出屏幕的敌机
        if (enemy.y > canvas.height + 50) {
            enemies.splice(i, 1);
            continue;
        }
        
        // 绘制敌机
        drawEnemy(enemy);
    }
}

// 绘制敌机
function drawEnemy(enemy) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    
    // 敌机主体（六边形）
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * enemy.width / 2;
        const y = Math.sin(angle) * enemy.height / 2;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    
    ctx.fillStyle = enemy.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 敌机中心
    ctx.beginPath();
    ctx.arc(0, 0, enemy.width / 4, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    
    ctx.restore();
}

// 敌机射击
function shootEnemyBullet(enemy) {
    bullets.push({
        x: enemy.x,
        y: enemy.y + enemy.height / 2,
        radius: 4,
        speed: -BULLET_SPEED * 0.8, // 向上发射
        color: '#ff8e53'
    });
}

// 更新粒子效果
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        // 移除死亡粒子
        if (particle.life <= 0) {
            particles.splice(i, 1);
            continue;
        }
        
        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color}, ${particle.life / 100})`;
        ctx.fill();
    }
}

// 创建爆炸粒子
function createExplosion(x, y, color) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 3 + 1,
            color: color,
            life: 50 + Math.random() * 50
        });
    }
}

// 检测碰撞
function checkCollisions() {
    // 子弹与敌机碰撞
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < bullet.radius + enemy.width / 2) {
                // 碰撞发生
                createExplosion(enemy.x, enemy.y, enemy.color);
                score += enemy.points;
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                
                // 检查升级
                if (score >= level * LEVEL_UP_SCORE) {
                    level++;
                    player.speed += 0.5; // 每级增加速度
                }
                
                updateUI();
                break;
            }
        }
    }
    
    // 玩家与敌机碰撞
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.width / 2 + enemy.width / 2) {
            // 碰撞发生
            createExplosion(enemy.x, enemy.y, enemy.color);
            lives--;
            enemies.splice(i, 1);
            
            updateUI();
            
            // 游戏结束检查
            if (lives <= 0) {
                gameOver();
            }
            
            // 玩家受伤效果
            player.color = '#ff6b6b';
            setTimeout(() => {
                player.color = '#4ecdc4';
            }, 300);
        }
    }
    
    // 玩家与敌机子弹碰撞
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // 只检查向上飞的子弹（敌机子弹）
        if (bullet.speed < 0) {
            const dx = player.x - bullet.x;
            const dy = player.y - bullet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < player.width / 2 + bullet.radius) {
                // 碰撞发生
                createExplosion(bullet.x, bullet.y, bullet.color);
                lives--;
                bullets.splice(i, 1);
                
                updateUI();
                
                // 游戏结束检查
                if (lives <= 0) {
                    gameOver();
                }
                
                // 玩家受伤效果
                player.color = '#ff6b6b';
                setTimeout(() => {
                    player.color = '#4ecdc4';
                }, 300);
            }
        }
    }
}

// 更新鼠标指示器
function updateMouseIndicator() {
    const indicator = document.getElementById('mouseIndicator');
    indicator.style.left = mouseX + 'px';
    indicator.style.top = mouseY + 'px';
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('gameOverModal').style.display = 'flex';
    
    // 隐藏鼠标指示器
    document.getElementById('mouseIndicator').style.display = 'none';
}

// 开始游戏
function startGame() {
    if (!gameRunning) {
        initGame();
        gameRunning = true;
        gamePaused = false;
        gameLoop();
        
        document.getElementById('pauseModal').style.display = 'none';
        document.getElementById('gameOverModal').style.display = 'none';
        
        console.log('游戏开始 - 鼠标控制模式');
    }
}

// 暂停游戏
function pauseGame() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        
        if (gamePaused) {
            document.getElementById('pauseModal').style.display = 'flex';
        } else {
            document.getElementById('pauseModal').style.display = 'none';
            gameLoop(); // 继续游戏循环
        }
    }
}

// 重新开始游戏
function restartGame() {
    gameRunning = false;
    gamePaused = false;
    
    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('pauseModal').style.display = 'none';
    
    setTimeout(() => {
        startGame();
    }, 100);
}

// 切换全屏
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`全屏请求失败: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// 发射子弹
function shootBullet() {
    if (!gameRunning || gamePaused) return;
    
    bullets.push({
        x: player.x,
        y: player.y - player.height / 2,
        radius: 5,
        speed: BULLET_SPEED,
        color: '#ffe66d'
    });
    
    // 射击音效（模拟）
    console.log('射击！');
}

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 初始化游戏
    initGame();
    
    // 鼠标移动事件
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseInCanvas = true;
    });
    
    canvas.addEventListener('mouseenter', () => {
        isMouseInCanvas = true;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isMouseInCanvas = false;
    });
    
    // 鼠标点击事件（发射子弹）
    canvas.addEventListener('click', (e) => {
        if (gameRunning && !gamePaused) {
            shootBullet();
        }
    });
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case ' ':
            case 'Spacebar':
                if (gameRunning && !gamePaused) {
                    shootBullet();
                }
                break;
                
            case 'Escape':
                pauseGame();
                break;
                
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
                
            case 'p':
            case 'P':
                pauseGame();
                break;
        }
    });
    
    // 按钮事件
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', pauseGame);
    document.getElementById('resetBtn').addEventListener('click', restartGame);
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    document.getElementById('resumeBtn').addEventListener('click', () => {
        pauseGame();
    });
    
    // 全屏变化事件
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            console.log('进入全屏模式');
        } else {
            console.log('退出全屏模式');
        }
    });
    
    // 窗口大小变化事件
    window.addEventListener('resize', () => {
        // 更新分辨率显示
        document.getElementById('resolution').textContent = `${canvas.width}x${canvas.height} (竖屏)`;
    });
    
    console.log('游戏加载完成 - 等待开始...');
});

// 游戏说明
console.log(`
==========================================
  竖屏太空射击游戏 - 鼠标控制版
==========================================
游戏特点:
1. 竖屏显示模式 (720x1280)
2. 鼠标控制飞机自由移动
3. 多种敌机类型
4. 粒子爆炸效果
5. 分数和等级系统

操作说明:
• 移动鼠标 - 控制飞机飞行
• 左键点击 - 发射子弹
• 空格键 - 发射子弹
• F键 - 切换全屏模式
• ESC键 - 暂停游戏

游戏目标:
• 消灭敌机获得分数
• 每1000分升一级
• 避免与敌机碰撞
• 尽可能获得高分
==========================================
`);