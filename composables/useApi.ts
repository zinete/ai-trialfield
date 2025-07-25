/**
 * API 调用统一管理
 * 提供类型安全的 API 调用方法
 */

import type {
  TodoWithTag,
  Tag,
  NewTodoForm,
  NewTagForm,
  ApiResponse,
  CreateInput,
  UpdateInput,
} from "~/types";

// ==================== Todo 相关 API ====================

/**
 * 获取用户的所有 todos
 * @param tagFilter 可选的标签过滤器
 */
export const useTodosApi = () => {
  const getTodos = (tagFilter?: string) => {
    const url = computed(() => {
      const params = new URLSearchParams();
      if (tagFilter) {
        params.append("tag", tagFilter);
      }
      return `/api/user/todos?${params.toString()}`;
    });

    return useFetch<TodoWithTag[]>(url);
  };

  const createTodo = async (data: {
    title: string;
    tagId?: number | null;
    deadline?: string;
  }) => {
    return await $fetch<TodoWithTag>("/api/user/todos", {
      method: "POST",
      body: data,
    });
  };

  const updateTodo = async (
    id: number,
    data: Partial<{ completed: boolean; title: string; tagId: number | null }>
  ) => {
    return await $fetch<TodoWithTag>(`/api/user/todos/${id}`, {
      method: "PATCH",
      body: data,
    });
  };

  const deleteTodo = async (id: number) => {
    return await $fetch(`/api/user/todos/${id}`, {
      method: "DELETE",
    });
  };

  return {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};

// ==================== Tag 相关 API ====================

/**
 * 标签相关 API 调用
 */
export const useTagsApi = () => {
  const getTags = () => {
    return useFetch<Tag[]>("/api/user/tags");
  };

  const createTag = async (data: { name: string; icon: string }) => {
    return await $fetch<Tag>("/api/user/tags", {
      method: "POST",
      body: data,
    });
  };

  const updateTag = async (
    id: number,
    data: Partial<{ name: string; icon: string }>
  ) => {
    return await $fetch<Tag>(`/api/user/tags/${id}`, {
      method: "PATCH",
      body: data,
    });
  };

  const deleteTag = async (id: number) => {
    return await $fetch(`/api/user/tags/${id}`, {
      method: "POST",
    });
  };

  return {
    getTags,
    createTag,
    updateTag,
    deleteTag,
  };
};

// ==================== 用户相关 API ====================

/**
 * 用户认证相关 API
 */
export const useAuthApi = () => {
  const login = async (credentials: { username: string; password: string }) => {
    return await $fetch<ApiResponse>("/api/user/user/login", {
      method: "POST",
      body: credentials,
    });
  };

  const register = async (userData: { username: string; password: string }) => {
    return await $fetch<ApiResponse>("/api/user/user/register", {
      method: "POST",
      body: userData,
    });
  };

  const logout = async () => {
    // 这里可以调用登出 API
    const { clear } = useUserSession();
    await clear();
  };

  return {
    login,
    register,
    logout,
  };
};

// ==================== 网站监控相关 API ====================

/**
 * 网站状态监控 API
 */
export const useStatusApi = () => {
  const checkStatus = (domain: string) => {
    return useFetch(`/api/check-status/${domain}`);
  };

  return {
    checkStatus,
  };
};

// ==================== 通用 API 工具 ====================

/**
 * 通用 API 错误处理
 */
export const useApiError = () => {
  const handleError = (error: any, defaultMessage = "操作失败") => {
    const toast = useToast();

    const message = error?.data?.message || error?.message || defaultMessage;

    toast.add({
      title: "错误",
      description: message,
      color: "error",
    });
  };

  const handleSuccess = (message: string, description?: string) => {
    const toast = useToast();

    toast.add({
      title: message,
      description,
      color: "success",
    });
  };

  return {
    handleError,
    handleSuccess,
  };
};
