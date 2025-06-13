<template>
  <div
    class="py-6 container mx-auto flex flex-row items-center w-screen h-screen gap-3"
  >
    <!-- left -->
    <UCard class="w-[200px] h-full xl:block hidden shadow"></UCard>
    <!-- right -->
    <section class="w-full h-full">
      <UCard class="xl:mx-0 mx-5">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <h2 class="text-xl font-semibold xl:block hidden">网站导航</h2>
              <UInput
                v-model="searchQuery"
                icon="i-heroicons-magnifying-glass"
                placeholder="搜索网站..."
                class="w-64"
              />
            </div>
            <div class="xl:flex gap-2 hidden">
              <UButton
                icon="i-heroicons-folder-plus"
                color="neutral"
                variant="ghost"
              >
                添加分类
              </UButton>
              <UButton icon="i-heroicons-plus" color="primary">
                添加网站
              </UButton>
            </div>
          </div>
        </template>

        <!-- 分类内容 -->
        <ScrolllBarBody
          :options="{
            scrollbars: {
              autoHide: 'leave',
            },
          }"
          v-if="filteredCategories.length"
          class="h-[calc(100vh-158px)] pr-6 pl-1"
        >
          <div
            v-for="category in filteredCategories"
            :key="category?.id"
            class="space-y-4 mb-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  :name="category?.icon || 'i-heroicons-folder'"
                  class="text-xl text-gray-400"
                />
                <h3 class="text-lg font-medium text-gray-900">
                  {{ category?.name }}
                </h3>
                <span class="text-sm text-gray-500"
                  >({{ category?.sites?.length }})</span
                >
              </div>
              <!-- <UDropdownMenu>
                <UButton
                  icon="i-heroicons-ellipsis-horizontal"
                  color="primary"
                  variant="ghost"
                  size="xs"
                />
              </UDropdownMenu> -->
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <UCard v-for="site in category?.sites" :key="site.id">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <img
                        :src="site.favicon || '/default-favicon.png'"
                        :alt="site.name"
                        class="w-6 h-6 rounded"
                      />
                      <h3 class="font-medium truncate">{{ site.name }}</h3>
                    </div>
                    <!-- <UDropdownMenu>
                      <UButton
                        icon="i-heroicons-ellipsis-horizontal"
                        color="info"
                        variant="ghost"
                        size="xs"
                      />
                    </UDropdownMenu> -->
                  </div>
                </template>

                <div class="space-y-2">
                  <a
                    :href="site.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-gray-500 hover:text-primary-500 truncate block"
                  >
                    {{ site.url }}
                  </a>
                </div>
              </UCard>
            </div>
          </div>
        </ScrolllBarBody>

        <!-- 空状态 -->
        <template v-else>
          <div class="py-12 text-center">
            <Icon
              name="i-heroicons-folder-open"
              class="mx-auto h-12 w-12 text-gray-400"
            />
            <h3 class="mt-2 text-sm font-semibold text-gray-900">暂无数据</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{
                searchQuery
                  ? "没有找到匹配的内容"
                  : "开始创建您的第一个网站分类吧"
              }}
            </p>
            <div class="mt-6">
              <UButton color="primary" icon="i-heroicons-folder-plus">
                添加分类
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </section>

    <!-- 添加/编辑分类模态框 -->
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "网址大全",
});
const categories = ref([
  {
    id: 1,
    name: "开发工具",
    icon: "i-heroicons-wrench",
    sites: [
      {
        id: 1,
        name: "GitHub",
        url: "https://github.com",
        favicon: "https://github.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "GitLab",
        url: "https://gitlab.com",
        favicon: "https://gitlab.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "Bitbucket",
        url: "https://bitbucket.org",
        favicon: "https://bitbucket.org/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "CodePen",
        url: "https://codepen.io",
        favicon: "https://codepen.io/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "JSFiddle",
        url: "https://jsfiddle.net",
        favicon: "https://jsfiddle.net/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "Docker Hub",
        url: "https://hub.docker.com",
        favicon: "https://hub.docker.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "NPM",
        url: "https://www.npmjs.com",
        favicon: "https://npmjs.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "StackBlitz",
        url: "https://stackblitz.com",
        favicon: "https://stackblitz.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "Vercel",
        url: "https://vercel.com",
        favicon: "https://vercel.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "Netlify",
        url: "https://www.netlify.com",
        favicon: "https://www.netlify.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
  {
    id: 2,
    name: "搜索引擎",
    icon: "i-heroicons-magnifying-glass",
    sites: [
      {
        id: 1,
        name: "Google",
        url: "https://google.com",
        favicon: "https://google.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "Bing",
        url: "https://bing.com",
        favicon: "https://bing.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "DuckDuckGo",
        url: "https://duckduckgo.com",
        favicon: "https://duckduckgo.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "Yahoo",
        url: "https://search.yahoo.com",
        favicon: "https://yahoo.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "Yandex",
        url: "https://yandex.com",
        favicon: "https://yandex.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "Baidu",
        url: "https://www.baidu.com",
        favicon: "https://www.baidu.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "StartPage",
        url: "https://www.startpage.com",
        favicon: "https://www.startpage.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "Ecosia",
        url: "https://www.ecosia.org",
        favicon: "https://www.ecosia.org/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "Qwant",
        url: "https://www.qwant.com",
        favicon: "https://www.qwant.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "Ask",
        url: "https://www.ask.com",
        favicon: "https://www.ask.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
  {
    id: 3,
    name: "视频平台",
    icon: "i-heroicons-video-camera",
    sites: [
      {
        id: 1,
        name: "YouTube",
        url: "https://youtube.com",
        favicon: "https://youtube.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "Netflix",
        url: "https://www.netflix.com",
        favicon: "https://www.netflix.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "Twitch",
        url: "https://www.twitch.tv",
        favicon: "https://www.twitch.tv/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "Vimeo",
        url: "https://vimeo.com",
        favicon: "https://vimeo.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "Dailymotion",
        url: "https://www.dailymotion.com",
        favicon: "https://www.dailymotion.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "Hulu",
        url: "https://www.hulu.com",
        favicon: "https://www.hulu.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "Disney+",
        url: "https://www.disneyplus.com",
        favicon: "https://www.disneyplus.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "Prime Video",
        url: "https://www.primevideo.com",
        favicon: "https://www.primevideo.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "TikTok",
        url: "https://www.tiktok.com",
        favicon: "https://www.tiktok.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "Crunchyroll",
        url: "https://www.crunchyroll.com",
        favicon: "https://www.crunchyroll.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
  {
    id: 4,
    name: "社交媒体",
    icon: "i-heroicons-user-group",
    sites: [
      {
        id: 1,
        name: "Facebook",
        url: "https://facebook.com",
        favicon: "https://facebook.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "Twitter",
        url: "https://twitter.com",
        favicon: "https://twitter.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "Instagram",
        url: "https://instagram.com",
        favicon: "https://instagram.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "LinkedIn",
        url: "https://linkedin.com",
        favicon: "https://linkedin.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "Pinterest",
        url: "https://pinterest.com",
        favicon: "https://pinterest.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "Reddit",
        url: "https://reddit.com",
        favicon: "https://reddit.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "Tumblr",
        url: "https://tumblr.com",
        favicon: "https://tumblr.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "Snapchat",
        url: "https://snapchat.com",
        favicon: "https://snapchat.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "Weibo",
        url: "https://weibo.com",
        favicon: "https://weibo.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "Discord",
        url: "https://discord.com",
        favicon: "https://discord.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
  {
    id: 5,
    name: "云服务",
    icon: "i-heroicons-cloud",
    sites: [
      {
        id: 1,
        name: "AWS",
        url: "https://aws.amazon.com",
        favicon: "https://aws.amazon.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "Azure",
        url: "https://azure.microsoft.com",
        favicon: "https://azure.microsoft.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "Google Cloud",
        url: "https://cloud.google.com",
        favicon: "https://cloud.google.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "DigitalOcean",
        url: "https://www.digitalocean.com",
        favicon: "https://www.digitalocean.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "Linode",
        url: "https://www.linode.com",
        favicon: "https://www.linode.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "Heroku",
        url: "https://www.heroku.com",
        favicon: "https://www.heroku.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "Firebase",
        url: "https://firebase.google.com",
        favicon: "https://firebase.google.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "Cloudflare",
        url: "https://www.cloudflare.com",
        favicon: "https://www.cloudflare.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "Vultr",
        url: "https://www.vultr.com",
        favicon: "https://www.vultr.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "OVHcloud",
        url: "https://www.ovhcloud.com",
        favicon: "https://www.ovhcloud.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
  {
    id: 6,
    name: "新闻资讯",
    icon: "i-heroicons-newspaper",
    sites: [
      {
        id: 1,
        name: "BBC",
        url: "https://www.bbc.com",
        favicon: "https://www.bbc.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "CNN",
        url: "https://edition.cnn.com",
        favicon: "https://edition.cnn.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "Reuters",
        url: "https://www.reuters.com",
        favicon: "https://www.reuters.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "The Guardian",
        url: "https://www.theguardian.com",
        favicon: "https://www.theguardian.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "New York Times",
        url: "https://www.nytimes.com",
        favicon: "https://www.nytimes.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "Al Jazeera",
        url: "https://www.aljazeera.com",
        favicon: "https://www.aljazeera.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "NPR",
        url: "https://www.npr.org",
        favicon: "https://www.npr.org/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "AP News",
        url: "https://apnews.com",
        favicon: "https://apnews.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "Bloomberg",
        url: "https://www.bloomberg.com",
        favicon: "https://www.bloomberg.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "Financial Times",
        url: "https://www.ft.com",
        favicon: "https://www.ft.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
  {
    id: 7,
    name: "学习资源",
    icon: "i-heroicons-academic-cap",
    sites: [
      {
        id: 1,
        name: "Coursera",
        url: "https://www.coursera.org",
        favicon: "https://www.coursera.org/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "edX",
        url: "https://www.edx.org",
        favicon: "https://www.edx.org/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "Khan Academy",
        url: "https://www.khanacademy.org",
        favicon: "https://www.khanacademy.org/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "Udemy",
        url: "https://www.udemy.com",
        favicon: "https://www.udemy.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "Udacity",
        url: "https://www.udacity.com",
        favicon: "https://www.udacity.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "Pluralsight",
        url: "https://www.pluralsight.com",
        favicon: "https://www.pluralsight.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "Codecademy",
        url: "https://www.codecademy.com",
        favicon: "https://www.codecademy.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "freeCodeCamp",
        url: "https://www.freecodecamp.org",
        favicon: "https://www.freecodecamp.org/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "MIT OpenCourseWare",
        url: "https://ocw.mit.edu",
        favicon: "https://ocw.mit.edu/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "Duolingo",
        url: "https://www.duolingo.com",
        favicon: "https://www.duolingo.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
  {
    id: 8,
    name: "设计资源",
    icon: "i-heroicons-paint-brush",
    sites: [
      {
        id: 1,
        name: "Dribbble",
        url: "https://dribbble.com",
        favicon: "https://dribbble.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "Behance",
        url: "https://www.behance.net",
        favicon: "https://www.behance.net/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "Figma",
        url: "https://www.figma.com",
        favicon: "https://www.figma.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "Adobe CC",
        url: "https://creativecloud.adobe.com",
        favicon: "https://creativecloud.adobe.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "Canva",
        url: "https://www.canva.com",
        favicon: "https://www.canva.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "InVision",
        url: "https://www.invisionapp.com",
        favicon: "https://www.invisionapp.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "Sketch",
        url: "https://www.sketch.com",
        favicon: "https://www.sketch.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "Unsplash",
        url: "https://unsplash.com",
        favicon: "https://unsplash.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "Pexels",
        url: "https://www.pexels.com",
        favicon: "https://www.pexels.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "Font Awesome",
        url: "https://fontawesome.com",
        favicon: "https://fontawesome.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
  {
    id: 9,
    name: "电子商务",
    icon: "i-heroicons-shopping-cart",
    sites: [
      {
        id: 1,
        name: "Amazon",
        url: "https://www.amazon.com",
        favicon: "https://www.amazon.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "eBay",
        url: "https://www.ebay.com",
        favicon: "https://www.ebay.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "AliExpress",
        url: "https://www.aliexpress.com",
        favicon: "https://www.aliexpress.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "Walmart",
        url: "https://www.walmart.com",
        favicon: "https://www.walmart.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "Shopify",
        url: "https://www.shopify.com",
        favicon: "https://www.shopify.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "Etsy",
        url: "https://www.etsy.com",
        favicon: "https://www.etsy.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "Target",
        url: "https://www.target.com",
        favicon: "https://www.target.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "Best Buy",
        url: "https://www.bestbuy.com",
        favicon: "https://www.bestbuy.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "Newegg",
        url: "https://www.newegg.com",
        favicon: "https://www.newegg.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "Zalando",
        url: "https://www.zalando.com",
        favicon: "https://www.zalando.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
  {
    id: 10,
    name: "娱乐休闲",
    icon: "i-heroicons-musical-note",
    sites: [
      {
        id: 1,
        name: "Spotify",
        url: "https://open.spotify.com",
        favicon: "https://open.spotify.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 2,
        name: "Apple Music",
        url: "https://music.apple.com",
        favicon: "https://music.apple.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 3,
        name: "SoundCloud",
        url: "https://soundcloud.com",
        favicon: "https://soundcloud.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 4,
        name: "Pandora",
        url: "https://www.pandora.com",
        favicon: "https://www.pandora.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 5,
        name: "Bandcamp",
        url: "https://bandcamp.com",
        favicon: "https://bandcamp.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 6,
        name: "Audible",
        url: "https://www.audible.com",
        favicon: "https://www.audible.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 7,
        name: "IMDb",
        url: "https://www.imdb.com",
        favicon: "https://www.imdb.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 8,
        name: "Goodreads",
        url: "https://www.goodreads.com",
        favicon: "https://www.goodreads.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 9,
        name: "Steam",
        url: "https://store.steampowered.com",
        favicon: "https://store.steampowered.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
      {
        id: 10,
        name: "Epic Games",
        url: "https://www.epicgames.com",
        favicon: "https://www.epicgames.com/favicon.ico",
        status: "active",
        lastCheck: new Date(),
      },
    ],
  },
]);

// 状态变量
const searchQuery = ref("");
const isCategoryModalOpen = ref(false);
const isSiteModalOpen = ref(false);
const isSubmitting = ref(false);
const editingCategory = ref(null);
const editingSite = ref(null);

// 表单数据
const categoryForm = ref({
  name: "",
  icon: "",
});

const siteForm = ref({
  categoryId: null,
  name: "",
  url: "",
  favicon: "",
});

// 计算属性
const totalSites = computed(() => {
  return categories.value.reduce(
    (sum, category) => sum + category.sites.length,
    0
  );
});

const activeSites = computed(() => {
  return categories.value.reduce((sum, category) => {
    return (
      sum + category.sites.filter((site) => site.status === "active").length
    );
  }, 0);
});

const inactiveSites = computed(() => totalSites.value - activeSites.value);

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;

  const query = searchQuery.value.toLowerCase();
  return categories.value
    .map((category) => {
      const filteredSites = category.sites.filter(
        (site) =>
          site.name.toLowerCase().includes(query) ||
          site.url.toLowerCase().includes(query)
      );

      if (filteredSites.length || category.name.toLowerCase().includes(query)) {
        return {
          ...category,
          sites: filteredSites,
        };
      }
      return null;
    })
    .filter(Boolean);
});

// 操作方法
const getCategoryActions = (category: any) => [
  {
    label: "编辑",
    icon: "i-heroicons-pencil",
  },
  {
    label: "删除",
    icon: "i-heroicons-trash",
    color: "red",
  },
];

const getSiteActions = (site: any) => [
  {
    label: "编辑",
    icon: "i-heroicons-pencil",
  },
  {
    label: "访问",
    icon: "i-heroicons-arrow-top-right-on-square",
  },
  {
    label: "删除",
    icon: "i-heroicons-trash",
    color: "red",
  },
];
</script>
