<template>
  <ClientOnly>
    <div class="h-full">
      {{ route }}
      <div id="map" class="h-full"></div>
    </div>
    <template #fallback>
      <div class="h-full flex items-center justify-center bg-gray-50">
        <div class="text-gray-500">加载地图中...</div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const props = defineProps<{
  route: any;
}>();

let map: any = null;
let currentPolyline: any = null;
let markers: any[] = [];

onMounted(async () => {
  const AMapLoader = (await import("@amap/amap-jsapi-loader")).default;

  AMapLoader.load({
    key: "84c5492da9030b904f8bc46caf51ad3a",
    version: "2.0",
    plugins: ["AMap.Riding", "AMap.ToolBar", "AMap.Scale", "AMap.HawkEye"],
  }).then((AMap) => {
    map = new AMap.Map("map", {
      zoom: 13,
      center: [114.298572, 30.584355],
      viewMode: "3D",
      pitch: 30,
      mapStyle: "amap://styles/normal",
    });

    // 添加地图控件
    map.addControl(new AMap.ToolBar());
    map.addControl(new AMap.Scale());
    map.addControl(new AMap.HawkEye({ isOpen: true }));

    if (props.route?.mapData) {
      showRoute(props.route.mapData);
    }
  });
});

const showRoute = (routeData: any) => {
  if (!map || !routeData) return;

  // 清除旧路线和标记
  if (currentPolyline) {
    map.remove(currentPolyline);
  }
  if (markers.length) {
    map.remove(markers);
    markers = [];
  }

  // 创建骑行路线规划实例
  const riding = new AMap.Riding({
    map: map,
    panel: "panel",
    hideMarkers: false,
  });

  // 规划骑行路线
  riding.search(
    routeData.startPoint,
    routeData.endPoint,
    {
      waypoints: routeData.waypoints,
    },
    (status: string, result: any) => {
      if (status === "complete") {
        // 绘制路线
        const pathPoints = result.routes[0].rides[0].path;
        currentPolyline = new AMap.Polyline({
          path: pathPoints,
          strokeColor: "#3B82F6",
          strokeWeight: 6,
          strokeOpacity: 0.8,
          showDir: true,
          dirColor: "#fff",
        });
        map.add(currentPolyline);

        // 添加起终点和途经点标记
        const startMarker = new AMap.Marker({
          position: pathPoints[0],
          content: '<div class="marker start-marker">起</div>',
        });
        const endMarker = new AMap.Marker({
          position: pathPoints[pathPoints.length - 1],
          content: '<div class="marker end-marker">终</div>',
        });
        markers.push(startMarker, endMarker);
        map.add(markers);

        // 调整视图
        map.setFitView([currentPolyline, ...markers], {
          padding: [100, 100, 100, 100],
        });
      }
    }
  );
};

watch(
  () => props.route?.mapData,
  (newRouteData) => {
    if (newRouteData && map) {
      showRoute(newRouteData);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.marker {
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
  border: 2px solid #3b82f6;
  font-size: 12px;
  font-weight: bold;
}
.start-marker {
  color: #10b981;
}
.end-marker {
  color: #ef4444;
}
</style>
