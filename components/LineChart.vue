<template>
  <div class="relative h-full">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
)

import { onMounted, watch, ref } from 'vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

const chartRef = ref(null)
let chart = null

const createChart = () => {
  if (!chartRef.value || !props.data.length) return

  // Ensure old chart is destroyed
  if (chart) {
    chart.destroy()
    chart = null
  }

  const ctx = chartRef.value.getContext('2d')
  
  // Clear the canvas
  ctx.clearRect(0, 0, chartRef.value.width, chartRef.value.height)
  
  chart = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: props.data.map(item => new Date(item.timestamp).toLocaleTimeString()),
      datasets: [
        {
          label: '响应时间 (ms)',
          data: props.data.map(item => item.responseTime),
          borderColor: '#39b077',
          backgroundColor: '#39b077',
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

// Use nextTick to ensure DOM is updated
watch(() => props.data, async () => {
  await nextTick()
  createChart()
}, { deep: true })

onMounted(() => {
  createChart()
})

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>