<template>
  <div>
    <div id="container" class="h-screen"></div>
  </div>
</template>

<script setup lang="ts">
onMounted(async () => {
  const AMapLoader = (await import("@amap/amap-jsapi-loader")).default;

  AMapLoader.load({
    key: "84c5492da9030b904f8bc46caf51ad3a",
    version: "2.0",
    AMapUI: {
      version: "1.1",
      plugins: ["overlay/SimpleMarker"],
    },
    // plugins: ["AMap.Driving", "AMap.ToolBar", "AMap.Scale"],
  }).then((AMap) => {
    let map = new AMap.Map("container", {
      zoom: 13,
      center: [114.298572, 30.584355], // 武汉市中心坐标

      viewMode: "3D",
      pitch: 30,
      features: ["bg", "road", "building", "point"],
      mapStyle: "amap://styles/normal",
    });
  });
});
</script>

<style scoped></style>
