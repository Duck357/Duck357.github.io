// 获取 Canvas 元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 定义玩家对象
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: 'white',
  speed: 5,
  angle: 0,
  health: 100,  // 玩家初始血量
  currentWeapon: 1, // 默认武器 1
  knives: [], // 刀的数组
};

// 定义子弹数组
const bullets = [];

// 定义敌人数组
const enemies = [];

// 定义道具数组
const items = [];

// 处理键盘输入
const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};

// 监听键盘事件
window.addEventListener('keydown', (e) => {
  if (e.key === 'w') keys.up = true;
  if (e.key === 's') keys.down = true;
  if (e.key === 'a') keys.left = true;
  if (e.key === 'd') keys.right = true;
  if (e.key === '1') switchWeapon(1);
  if (e.key === '2') switchWeapon(2);
  if (e.key === '3') switchWeapon(3);
  if (e.key === ' ') fireKnives();  // 按下空格键发射刀
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'w') keys.up = false;
  if (e.key === 's') keys.down = false;
  if (e.key === 'a') keys.left = false;
  if (e.key === 'd') keys.right = false;
});

// 监听鼠标点击事件，发射子弹
canvas.addEventListener('click', (e) => {
  fireWeapon(e.clientX, e.clientY);
});

// 切换武器
function switchWeapon(weaponNumber) {
  player.currentWeapon = weaponNumber;
}

// 获取当前武器的属性
function getWeaponProperties() {
  if (player.currentWeapon === 1) {
    return { rateOfFire: 0.1, damage: 5 };  // 高射速低伤害
  } else if (player.currentWeapon === 2) {
    return { rateOfFire: 100000000000000000, damage: 0.1 }; // 普通射速普通伤害
  } else if (player.currentWeapon === 3) {
    return { rateOfFire: 0.5, damage: 20 }; // 低射速高伤害
  }
  return { rateOfFire: 0.2, damage: 10 }; // 默认武器 2
}

// 更新玩家位置
function movePlayer() {
  if (keys.up) player.y -= player.speed;
  if (keys.down) player.y += player.speed;
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;
}

// 绘制玩家
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

// 绘制玩家血量条
function drawHealthBar() {
  const barWidth = 200;
  const barHeight = 20;
  ctx.fillStyle = 'red';
  ctx.fillRect(10, 10, barWidth, barHeight);  // 背景
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, (player.health / 100) * barWidth, barHeight);  // 血量
  ctx.strokeStyle = 'white';
  ctx.strokeRect(10, 10, barWidth, barHeight);  // 边框
}

// 更新子弹
function moveBullets() {
  bullets.forEach(bullet => {
    bullet.x += Math.cos(bullet.angle) * bullet.speed;
    bullet.y += Math.sin(bullet.angle) * bullet.speed;
  });
}

// 绘制子弹
function drawBullets() {
  bullets.forEach(bullet => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = bullet.color;
    ctx.fill();
    ctx.closePath();
  });
}

// 创建敌人
function createEnemy() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const speed = 0.2 + Math.random() * 2;  // 随机速度
  const health = 50 + Math.random() * 50;  // 随机血量

  enemies.push({
    x: x,
    y: y,
    radius: 20,
    color: 'green',
    speed: speed,
    health: health
  });
}

// 绘制敌人血量条
function drawEnemyHealthBar(enemy) {
  const barWidth = 40;
  const barHeight = 5;
  const healthPercentage = enemy.health / 100;

  ctx.fillStyle = 'red';
  ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 10, barWidth, barHeight);

  ctx.fillStyle = 'green';
  ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 10, barWidth * healthPercentage, barHeight);
}

// 更新敌人位置，向玩家靠近
function moveEnemies() {
  enemies.forEach(enemy => {
    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    enemy.x += Math.cos(angle) * enemy.speed;
    enemy.y += Math.sin(angle) * enemy.speed;
  });
}

// 绘制敌人
function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
    ctx.closePath();
    
    // 只有血量大于 0 时才绘制血量条
    if (enemy.health > 0) {
      drawEnemyHealthBar(enemy);
    }
  });
}

// 创建道具
function createItem() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const type = Math.random() < 0.5 ? 'health' : 'knife';  // 50%概率生成不同类型的道具

  items.push({
    x: x,
    y: y,
    radius: 10,
    color: type === 'health' ? 'blue' : 'orange',
    type: type
  });
}

// 绘制道具
function drawItems() {
  items.forEach(item => {
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.closePath();
  });
}

// 检测碰撞
function checkCollisions() {
  // 检测子弹与敌人碰撞
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      const dx = bullet.x - enemy.x;
      const dy = bullet.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < enemy.radius + bullet.radius) {
        // 减少敌人血量
        enemy.health -= bullet.damage;
        // 删除子弹
        bullets.splice(bulletIndex, 1);

        // 如果敌人血量为 0，则销毁敌人
        if (enemy.health <= 0) {
          enemies.splice(enemyIndex, 1);
        }
      }
    });
  });

  // 检测玩家与敌人碰撞
  enemies.forEach((enemy, enemyIndex) => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.radius + enemy.radius) {
      // 玩家与敌人碰撞时，玩家血量减少
      player.health -= 1;

      // 如果玩家血量为 0，则结束游戏（暂时不做结束界面）
      if (player.health <= 0) {
        alert('Game Over');
        window.location.reload();  // 刷新页面重新开始
      }
    }
  });

  // 检测玩家与道具碰撞
  items.forEach((item, itemIndex) => {
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.radius + item.radius) {
      if (item.type === 'health') {
        player.health = Math.min(player.health + 20, 100);  // 恢复玩家血量
      } else if (item.type === 'knife') {
        // 增加一个刀
        addKnife();
      }

      // 删除道具
      items.splice(itemIndex, 1);
    }
  });

  // 检测刀与敌人碰撞
  player.knives.forEach(knife => {
    enemies.forEach((enemy, enemyIndex) => {
      const dx = knife.x - enemy.x;
      const dy = knife.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < enemy.radius + knife.radius) {
        // 减少敌人血量
        enemy.health -= 10;  // 刀的伤害
        if (enemy.health <= 1) {
          enemies.splice(enemyIndex, 1);
        }
      }
    });
  });
}


// 增加刀
function addKnife() {
  player.knives.push({
    x: player.x,
    y: player.y,
    radius: 10,
    color: 'orange',
    angle: 0,  // 初始角度为 0
    speed: 0.2,  // 旋转速度
  });
}

// 更新刀的旋转
function moveKnives() {
  player.knives.forEach(knife => {
    knife.angle += knife.speed;  // 旋转
    knife.x = player.x + Math.cos(knife.angle) * 70;  // 30 为刀与玩家的半径距离
    knife.y = player.y + Math.sin(knife.angle) * 70;  // 刀与玩家的旋转半径
  });
}

// 绘制刀
function drawKnives() {
  player.knives.forEach(knife => {
    ctx.beginPath();
    ctx.arc(knife.x, knife.y, knife.radius, 0, Math.PI * 2);
    ctx.fillStyle = knife.color;
    ctx.fill();
    ctx.closePath();
  });
}

// 发射子弹
function fireWeapon(targetX, targetY) {
  const weaponProperties = getWeaponProperties();
  const angle = Math.atan2(targetY - player.y, targetX - player.x);  // 计算角度

  bullets.push({
    x: player.x,
    y: player.y,
    radius: 5,
    color: 'red',
    angle: angle,
    speed: 10,
    damage: weaponProperties.damage,
  });

  if (weaponProperties.rateOfFire > 0.2) {
    setTimeout(() => fireWeapon(targetX, targetY), weaponProperties.rateOfFire * 100);  // 快速武器连发
  }
}

// 游戏主循环
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清空画布

  movePlayer();  // 更新玩家位置
  moveBullets();  // 更新子弹位置
  moveEnemies();  // 更新敌人位置
  moveKnives();   // 更新刀的位置
  checkCollisions();  // 检测碰撞
  drawHealthBar();  // 绘制玩家血量
  drawPlayer();  // 绘制玩家
  drawBullets();  // 绘制子弹
  drawEnemies();  // 绘制敌人
  drawKnives();   // 绘制刀
  drawItems();  // 绘制道具

  // 请求下一帧
  requestAnimationFrame(gameLoop);
}

// 定时生成敌人
setInterval(createEnemy, 2000);  // 每2秒生成一个敌人

// 定时生成道具
setInterval(createItem, 3000);  // 每5秒生成一个道具

// 启动游戏
gameLoop();
