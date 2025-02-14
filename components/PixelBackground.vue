<template>
  <div class="fixed inset-0 -z-10 opacity-10">
    <canvas ref="canvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let animationFrame: number
let ctx: CanvasRenderingContext2D | null = null

// 修改蛇的数据结构，添加速度属性
interface SnakeSegment {
  x: number
  y: number
  life: number
  color: string
  speed: number  // 添加速度属性
}

const snakes: SnakeSegment[][] = []



// 添加随机颜色生成函数
const colors = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#14b8a6', // teal
  '#f97316', // orange
  '#f43f5e', // red
]
const maxSnakes = colors.length
const snakeLength = 120
const maxLife = 88

const props = withDefaults(defineProps<{
  pixelSize?: number
  speed?: number
}>(), {
  pixelSize: 18,
  speed: 3000
})

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

function initCanvas() {
  if (!canvas.value) return
  
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.value.getBoundingClientRect()
  
  canvas.value.width = rect.width * dpr
  canvas.value.height = rect.height * dpr
  
  ctx = canvas.value.getContext('2d')
  if (ctx) {
    ctx.scale(dpr, dpr)
  }
}

function createSnake() {
  const cols = Math.ceil(canvas.value!.width / props.pixelSize)
  const rows = Math.ceil(canvas.value!.height / props.pixelSize)
  
  const snake: SnakeSegment[] = []
  const x = Math.floor(Math.random() * cols)
  const y = Math.floor(Math.random() * rows)
  const color = getRandomColor()
  const speed = Math.random() * 0.5 + 0.5  // 随机生成 0.5-1 之间的速度
  
  for (let i = 0; i < snakeLength; i++) {
    snake.push({
      x,
      y,
      life: maxLife - i * (maxLife / snakeLength),
      color,
      speed
    })
  }
  
  return snake
}

function updateSnake(snake: SnakeSegment[]) {
  const head = snake[0]
  
  // 根据速度决定是否更新位置
  if (Math.random() < head.speed) {
    const direction = Math.floor(Math.random() * 4)
    let newX = head.x
    let newY = head.y
    
    switch (direction) {
      case 0: newY--; break
      case 1: newY++; break
      case 2: newX--; break
      case 3: newX++; break
    }
    
    snake.unshift({
      x: newX,
      y: newY,
      life: maxLife,
      color: head.color,
      speed: head.speed
    })
  }
  
  // 更新所有段的生命值
  for (let i = 0; i < snake.length; i++) {
    snake[i].life--
  }
  
  // 移除死亡的段
  while (snake.length > 0 && snake[snake.length - 1].life <= 0) {
    snake.pop()
  }
  
  return snake.length > 0
}

function drawPixels() {
  if (!ctx || !canvas.value) return
  
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // 更新和绘制所有蛇
  for (let i = snakes.length - 1; i >= 0; i--) {
    const snake = snakes[i]
    const alive = updateSnake(snake)
    
    if (!alive) {
      snakes.splice(i, 1)
      continue
    }
    
    // 绘制蛇
    snake.forEach(segment => {
      const alpha = segment.life / maxLife
      ctx!.fillStyle = `${segment.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`
      ctx!.fillRect(
        segment.x * props.pixelSize,
        segment.y * props.pixelSize,
        props.pixelSize - 1,
        props.pixelSize - 1
      )
    })
  }
  
  // 添加新的蛇
  if (snakes.length < maxSnakes && Math.random() < 0.05) {
    snakes.push(createSnake())
  }
  
  animationFrame = requestAnimationFrame(drawPixels)
}

function handleResize() {
  initCanvas()
}

onMounted(() => {
  initCanvas()
  drawPixels()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', handleResize)
})
</script>