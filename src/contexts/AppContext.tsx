'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { toolRegistry } from '@/lib/registry/tools';
import { Tool, ToolCategory, ToolState, SearchFilters } from '@/types/tool';

interface AppContextType {
  // Search functionality
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  filteredTools: Tool[];

  // Tool management
  allTools: Tool[];
  allCategories: ToolCategory[];
  getTool: (id: string) => Tool | undefined;
  getToolsByCategory: (categoryId: string) => Tool[];

  // User preferences
  toolState: ToolState;
  toggleFavorite: (toolId: string) => void;
  addToRecent: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;

  // Popular and featured tools
  popularTools: Tool[];
  featuredTools: Tool[];
  newTools: Tool[];

  // Loading and error states
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [toolState, setToolState] = useState<ToolState>({
    isLoading: false,
    error: null,
    favorites: [],
    recentTools: []
  });

  // Get all tools and categories from registry
  const allTools = useMemo(() => {
    return toolRegistry.getAllTools().map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
      tags: tool.tags,
      featured: tool.featured,
      popular: tool.popular,
      new: tool.new,
      path: tool.path
    }));
  }, []);

  const allCategories = useMemo(() => {
    return toolRegistry.getAllCategories().map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      description: category.description,
      tools: toolRegistry.getToolsByCategory(category.id).map(tool => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        icon: tool.icon,
        tags: tool.tags,
        featured: tool.featured,
        popular: tool.popular,
        new: tool.new,
        path: tool.path
      })),
      color: category.color,
      order: category.order
    }));
  }, []);

  // Filter tools based on search term and filters
  const filteredTools = useMemo(() => {
    let tools = allTools;

    // Apply search term
    if (searchTerm) {
      tools = toolRegistry.searchTools(searchTerm).map(tool => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        icon: tool.icon,
        tags: tool.tags,
        featured: tool.featured,
        popular: tool.popular,
        new: tool.new,
        path: tool.path
      }));
    }

    // Apply filters
    if (searchFilters.category) {
      tools = tools.filter(tool => tool.category === searchFilters.category);
    }

    if (searchFilters.tags && searchFilters.tags.length > 0) {
      tools = tools.filter(tool =>
        searchFilters.tags!.some(tag => tool.tags?.includes(tag))
      );
    }

    if (searchFilters.featured) {
      tools = tools.filter(tool => tool.featured);
    }

    if (searchFilters.popular) {
      tools = tools.filter(tool => tool.popular);
    }

    if (searchFilters.new) {
      tools = tools.filter(tool => tool.new);
    }

    return tools;
  }, [searchTerm, searchFilters, allTools]);

  // Popular, featured, and new tools
  const popularTools = useMemo(() => {
    return toolRegistry.getPopularTools().map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
      tags: tool.tags,
      featured: tool.featured,
      popular: tool.popular,
      new: tool.new,
      path: tool.path
    }));
  }, []);

  const featuredTools = useMemo(() => {
    return toolRegistry.getFeaturedTools().map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
      tags: tool.tags,
      featured: tool.featured,
      popular: tool.popular,
      new: tool.new,
      path: tool.path
    }));
  }, []);

  const newTools = useMemo(() => {
    return toolRegistry.getNewTools().map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      icon: tool.icon,
      tags: tool.tags,
      featured: tool.featured,
      popular: tool.popular,
      new: tool.new,
      path: tool.path
    }));
  }, []);

  // Tool management functions
  const getTool = useCallback((id: string) => {
    return allTools.find(tool => tool.id === id);
  }, [allTools]);

  const getToolsByCategory = useCallback((categoryId: string) => {
    return allTools.filter(tool => tool.category === categoryId);
  }, [allTools]);

  const toggleFavorite = useCallback((toolId: string) => {
    setToolState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(toolId)
        ? prev.favorites.filter(id => id !== toolId)
        : [...prev.favorites, toolId]
    }));
  }, []);

  const addToRecent = useCallback((toolId: string) => {
    setToolState(prev => {
      const recent = [toolId, ...prev.recentTools.filter(id => id !== toolId)].slice(0, 10);
      return { ...prev, recentTools: recent };
    });
  }, []);

  const isFavorite = useCallback((toolId: string) => {
    return toolState.favorites.includes(toolId);
  }, [toolState.favorites]);

  // Load saved state from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('minitools-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        setToolState(prev => ({
          ...prev,
          favorites: parsed.favorites || [],
          recentTools: parsed.recentTools || []
        }));
      }
    } catch (error) {
      console.warn('Failed to load saved state:', error);
    }
  }, []);

  // Save state to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('minitools-state', JSON.stringify({
        favorites: toolState.favorites,
        recentTools: toolState.recentTools
      }));
    } catch (error) {
      console.warn('Failed to save state:', error);
    }
  }, [toolState.favorites, toolState.recentTools]);

  const value: AppContextType = {
    // Search functionality
    searchTerm,
    setSearchTerm,
    searchFilters,
    setSearchFilters,
    filteredTools,

    // Tool management
    allTools,
    allCategories,
    getTool,
    getToolsByCategory,

    // User preferences
    toolState,
    toggleFavorite,
    addToRecent,
    isFavorite,

    // Popular and featured tools
    popularTools,
    featuredTools,
    newTools,

    // Loading and error states
    isLoading: toolState.isLoading,
    error: toolState.error
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};