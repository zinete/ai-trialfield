/**
 * 统一类型管理文件
 * 包含项目中所有共享的类型定义
 */

// ==================== 数据库相关类型 ====================

// 基础数据库表类型
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// 用户类型
export interface User extends BaseEntity {
  username: string;
  password: string;
}

// 标签类型
export interface Tag extends BaseEntity {
  userId: number | null;
  name: string;
  icon: string;
}

// 基础 Todo 类型
export interface Todo extends BaseEntity {
  userId: number | null;
  tagId: number | null;
  title: string;
  completed: boolean;
  deadline: Date | null;
}

// 包含标签信息的 Todo 类型
export interface TodoWithTag extends Todo {
  tag?: {
    id: number;
    name: string;
    icon: string;
  } | null;
}

// 网站监控类型
export interface Site extends BaseEntity {
  name: string;
  url: string;
  favicon: string;
  status: string;
  desc?: string;
  sort?: number;
  lastCheck: Date;
}

// ==================== 表单相关类型 ====================

// 新建标签表单
export interface NewTagForm {
  name: string;
  key: {
    icon: string;
    label: string;
  };
}

// 新建任务表单
export interface NewTodoForm {
  title?: string;
  deadline?: string;
  tagId?: number;
}

// 登录表单
export interface LoginForm {
  username: string;
  password: string;
}

// 注册表单
export interface RegisterForm {
  username: string;
  password: string;
}

// ==================== API 响应类型 ====================

// 通用 API 响应
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data?: T;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== UI 组件类型 ====================

// 下拉菜单项类型
export interface DropdownMenuItem {
  label: string;
  icon?: string;
  onSelect?: () => void;
}

// 选择器选项类型
export interface SelectOption {
  id: number;
  name: string;
  icon?: string;
  label?: string;
  value?: any;
}

// Toast 通知类型
export interface ToastNotification {
  title: string;
  description?: string;
  color: "success" | "error" | "warning" | "info";
}

// ==================== 路由相关类型 ====================

// 路由参数类型
export interface RouteParams {
  type?: string;
  domain?: string;
  message?: string;
  id?: string;
}

// ==================== 状态管理类型 ====================

// 用户会话状态
export interface UserSession {
  user: User | null;
  loggedIn: boolean;
}

// 加载状态
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// ==================== 工具类型 ====================

// 可选字段类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// 创建类型（排除 id 和时间戳）
export type CreateInput<T extends BaseEntity> = Omit<
  T,
  "id" | "createdAt" | "updatedAt"
>;

// 更新类型（所有字段可选，排除 id 和 createdAt）
export type UpdateInput<T extends BaseEntity> = Partial<
  Omit<T, "id" | "createdAt">
> & {
  updatedAt?: Date;
};

// ==================== 网络监控相关类型 ====================

// 网站状态检查结果
export interface StatusCheckResult {
  statusCode: number;
  responseTime: number;
  headers: Record<string, any>;
  message: string;
  data?: any;
  protocol: "http" | "https";
}

// 图表数据点
export interface ChartDataPoint {
  timestamp: number;
  responseTime: number;
  statusCode: number;
}

// ==================== 导出所有类型 ====================

// 重新导出数据库类型以保持兼容性
export type { User as Users, Tag as Tags, Todo as Todos, Site as Sites };
