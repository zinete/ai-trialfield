<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 text-emerald-500">
      网站状态监控: <a href="/">{{ domain }}</a>
    </h1>

    <div class="mb-4 text-sm text-gray-600">
      下次更新时间: {{ countdown }} 秒
    </div>

    <div class="bg-white p-4 rounded shadow text-sm mb-4">
      <h2 class="font-bold mb-2">Response time</h2>
      <select
        v-model="timeRange"
        class="mb-4 border rounded text-lg"
        @change="handleTimeRangeChange"
      >
        <option value="1">1分钟</option>
        <option value="5">5分钟</option>
        <option value="30">30分钟</option>
      </select>
      <div class="w-full h-[400px]">
        <ClientOnly>
          <LineChart :data="filteredData" />
        </ClientOnly>
      </div>
    </div>

    <div class="grid gap-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded shadow font-blod">
          <h2 class="font-bold mb-2">当前状态</h2>
          <div class="text-sm">
            <p
              :class="
                currentStatus?.statusCode === 500
                  ? 'text-red-600'
                  : 'text-emerald-600'
              "
            >
              状态码: {{ currentStatus?.statusCode }}
            </p>
            <p>响应时间: {{ currentStatus?.responseTime }}ms</p>
            <p>状态信息: {{ currentStatus?.message }}</p>
          </div>
        </div>

        <div class="bg-white p-4 rounded shadow text-sm">
          <h2 class="font-bold mb-2">Response Headers</h2>
          <div class="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <pre
              class="whitespace-pre-wrap break-words font-mono text-gray-700"
              >{{ JSON.stringify(currentStatus?.headers, null, 2) }}</pre
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIndexDB } from "~/composables/useIndexDB";

const route = useRoute();
const domain = ref<any>(route.params.domain);
const currentStatus = ref<any>(null);
const error = ref("");
const chartData = ref<any>([]);
const last30lint = ref<any>([]);
const { saveStatus, getStatusHistory } = useIndexDB();

// 获取状态并更新数据
const fetchStatus = async () => {
  try {
    const { data, status } = await useFetch(
      `/api/check-status/${domain.value}`
    );
    currentStatus.value = { ...data.value, status };
    if (data.value) {
      await saveStatus(
        domain.value,
        data.value.statusCode,
        data.value.responseTime
      );
      updateChartData();
      countdown.value = updateInterval; // 重置倒计时
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "检测失败：未知错误";
  }
};

const timeRange = ref("30");
const filteredData = computed(() => {
  const now = Date.now();
  const rangeInMs = Number(timeRange.value) * 60 * 1000;
  return last30lint.value.filter((item: { timestamp: number }) => {
    return now - (item as { timestamp: number }).timestamp <= rangeInMs;
  });
});

const handleTimeRangeChange = () => {
  updateChartData();
};

// 更新图表数据
const updateChartData = async () => {
  const history = await getStatusHistory(domain.value);
  chartData.value = history;
  last30lint.value = history.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp).getTime(),
  }));
};

// 监听域名变化并获取数据
watchEffect(() => {
  if (domain.value) {
    fetchStatus();
  }
});

const countdown = ref(10);
const updateInterval = 10; // 更新间隔，单位秒

// 更新倒计时
const updateCountdown = () => {
  countdown.value = countdown.value - 1;
  if (countdown.value <= 0) {
    countdown.value = updateInterval;
  }
};

// 设置定时器
onMounted(() => {
  const timer = setInterval(fetchStatus, 1000 * updateInterval);
  const countdownTimer = setInterval(updateCountdown, 1000);

  onUnmounted(() => {
    clearInterval(timer);
    clearInterval(countdownTimer);
  });
});
</script>
