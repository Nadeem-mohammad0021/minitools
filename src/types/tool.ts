export interface Tool {
  id: string;
  name: string;
  description: string;
  category?: string;
  icon?: string;
  tags?: string[];
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
  path?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  tools: Tool[];
  color?: string;
  order?: number;
}

export interface ToolState {
  isLoading: boolean;
  error: string | null;
  favorites: string[];
  recentTools: string[];
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
}

export interface ToolMetrics {
  id: string;
  usage: number;
  lastUsed: Date;
  averageTime: number;
}