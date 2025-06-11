<template>
  <div class="p-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-primary-50">
            <Icon
              name="i-heroicons-globe-alt"
              class="text-2xl text-primary-500"
            />
          </div>
          <div>
            <div class="text-sm text-gray-500">总站点数</div>
            <div class="text-xl font-semibold">{{ totalSites }}</div>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-green-50">
            <Icon
              name="i-heroicons-check-circle"
              class="text-2xl text-green-500"
            />
          </div>
          <div>
            <div class="text-sm text-gray-500">正常运行</div>
            <div class="text-xl font-semibold">{{ activeSites }}</div>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-red-50">
            <Icon name="i-heroicons-x-circle" class="text-2xl text-red-500" />
          </div>
          <div>
            <div class="text-sm text-gray-500">异常站点</div>
            <div class="text-xl font-semibold">{{ inactiveSites }}</div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 主内容区 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">网站导航</h2>
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="搜索网站..."
              class="w-64"
            />
          </div>
          <div class="flex gap-2">
            <UButton
              icon="i-heroicons-folder-plus"
              color="gray"
              variant="ghost"
              @click="openCategoryModal()"
            >
              添加分类
            </UButton>
            <UButton
              icon="i-heroicons-plus"
              color="primary"
              @click="openSiteModal()"
            >
              添加网站
            </UButton>
          </div>
        </div>
      </template>

      <!-- 分类内容 -->
      <div v-if="filteredCategories.length" class="space-y-8">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="space-y-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon
                :name="category.icon || 'i-heroicons-folder'"
                class="text-xl text-gray-400"
              />
              <h3 class="text-lg font-medium text-gray-900">
                {{ category.name }}
              </h3>
              <span class="text-sm text-gray-500"
                >({{ category.sites.length }})</span
              >
            </div>
            <UDropdown :items="getCategoryActions(category)">
              <UButton
                icon="i-heroicons-ellipsis-horizontal"
                color="gray"
                variant="ghost"
                size="xs"
              />
            </UDropdown>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UCard
              v-for="site in category.sites"
              :key="site.id"
              :ui="{
                base: 'relative overflow-hidden transition-all hover:shadow-lg',
                header: { padding: 'p-3' },
                body: { padding: 'p-3' },
              }"
            >
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img
                      :src="site.favicon || '/default-favicon.png'"
                      :alt="site.name"
                      class="w-6 h-6 rounded"
                      @error="handleImageError"
                    />
                    <h3 class="font-medium truncate">{{ site.name }}</h3>
                  </div>
                  <UDropdown :items="getSiteActions(site, category)">
                    <UButton
                      icon="i-heroicons-ellipsis-horizontal"
                      color="gray"
                      variant="ghost"
                      size="xs"
                    />
                  </UDropdown>
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
                <div class="flex items-center gap-2">
                  <UBadge
                    :color="site.status === 'active' ? 'green' : 'red'"
                    variant="subtle"
                    size="sm"
                  >
                    {{ site.status === "active" ? "正常" : "异常" }}
                  </UBadge>
                  <span class="text-xs text-gray-400">
                    最后检查: {{ formatDate(site.lastCheck) }}
                  </span>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>

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
            <UButton
              color="primary"
              icon="i-heroicons-folder-plus"
              @click="openCategoryModal()"
            >
              添加分类
            </UButton>
          </div>
        </div>
      </template>
    </UCard>

    <!-- 添加/编辑分类模态框 -->
  </div>
</template>

<script setup>
const categories = ref([
  {
    id: 1,
    name: "常用工具",
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
    ],
  },
  {
    id: 2,
    name: "搜索引擎",
    icon: "i-heroicons-magnifying-glass",
    sites: [
      {
        id: 2,
        name: "Google",
        url: "https://google.com",
        favicon: "https://google.com/favicon.ico",
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
const getCategoryActions = (category) => [
  {
    label: "编辑",
    icon: "i-heroicons-pencil",
    click: () => openCategoryModal(category),
  },
  {
    label: "删除",
    icon: "i-heroicons-trash",
    color: "red",
    click: () => handleCategoryDelete(category),
  },
];

const getSiteActions = (site, category) => [
  {
    label: "编辑",
    icon: "i-heroicons-pencil",
    click: () => openSiteModal(site, category),
  },
  {
    label: "访问",
    icon: "i-heroicons-arrow-top-right-on-square",
    click: () => window.open(site.url, "_blank"),
  },
  {
    label: "删除",
    icon: "i-heroicons-trash",
    color: "red",
    click: () => handleSiteDelete(site, category),
  },
];

// 分类相关方法
const openCategoryModal = (category = null) => {
  editingCategory.value = category;
  if (category) {
    categoryForm.value = { ...category };
  } else {
    categoryForm.value = { name: "", icon: "" };
  }
  isCategoryModalOpen.value = true;
};

const handleCategorySubmit = async () => {
  isSubmitting.value = true;
  try {
    if (editingCategory.value) {
      const index = categories.value.findIndex(
        (c) => c.id === editingCategory.value.id
      );
      if (index !== -1) {
        categories.value[index] = {
          ...categories.value[index],
          ...categoryForm.value,
        };
      }
    } else {
      categories.value.push({
        id: Date.now(),
        ...categoryForm.value,
        sites: [],
      });
    }
    isCategoryModalOpen.value = false;
  } catch (error) {
    console.error("操作失败:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCategoryDelete = async (category) => {
  if (await window.confirm("确定要删除这个分类吗？其下所有网站也会被删除。")) {
    categories.value = categories.value.filter((c) => c.id !== category.id);
  }
};

// 网站相关方法
const openSiteModal = (site = null, category = null) => {
  editingSite.value = site;
  if (site && category) {
    siteForm.value = {
      ...site,
      categoryId: category.id,
    };
  } else {
    siteForm.value = {
      categoryId: null,
      name: "",
      url: "",
      favicon: "",
    };
  }
  isSiteModalOpen.value = true;
};

const handleSiteSubmit = async () => {
  isSubmitting.value = true;
  try {
    const category = categories.value.find(
      (c) => c.id === siteForm.value.categoryId
    );
    if (!category) throw new Error("分类不存在");

    const siteData = {
      id: editingSite.value?.id || Date.now(),
      name: siteForm.value.name,
      url: siteForm.value.url,
      favicon: siteForm.value.favicon,
      status: "active",
      lastCheck: new Date(),
    };

    if (editingSite.value) {
      const siteIndex = category.sites.findIndex(
        (s) => s.id === editingSite.value.id
      );
      if (siteIndex !== -1) {
        category.sites[siteIndex] = siteData;
      }
    } else {
      category.sites.push(siteData);
    }
    isSiteModalOpen.value = false;
  } catch (error) {
    console.error("操作失败:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleSiteDelete = async (site, category) => {
  if (await window.confirm("确定要删除这个网站吗？")) {
    const categoryIndex = categories.value.findIndex(
      (c) => c.id === category.id
    );
    if (categoryIndex !== -1) {
      categories.value[categoryIndex].sites = category.sites.filter(
        (s) => s.id !== site.id
      );
    }
  }
};

const handleImageError = (event) => {
  event.target.src = "/default-favicon.png";
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
</script>
