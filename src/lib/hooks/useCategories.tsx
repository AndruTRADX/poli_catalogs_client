import { useMemo } from "react";
import { CATEGORIES, type Category, type CategoryStats } from "../types/Category";
import type { Article } from "../types/Article";

export const useCategories = (articles?: Article[]) => {
  const categories = useMemo(() => CATEGORIES, []);

  const categoryStats = useMemo(() => {
    if (!articles) return [];
    
    const stats: CategoryStats[] = [];
    const categoryCount: Record<string, number> = {};
    
    articles.forEach(article => {
      categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
    });
    
    CATEGORIES.forEach(category => {
      stats.push({
        category,
        count: categoryCount[category] || 0,
      });
    });
    
    return stats;
  }, [articles]);

  const getArticlesByCategory = useMemo(() => {
    return (category: Category) => {
      if (!articles) return [];
      return articles.filter(article => article.category === category);
    };
  }, [articles]);

  return {
    categories,
    categoryStats,
    getArticlesByCategory,
  };
}; 