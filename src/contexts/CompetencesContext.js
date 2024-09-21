import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCategories, saveCategory, saveCompetence } from '../services/api';

const CompetencesContext = createContext();

export const CompetencesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const addCategory = async (newCategory) => {
    try {
      const savedCategory = await saveCategory(newCategory);
      setCategories(prevCategories => [...prevCategories, savedCategory]);
    } catch (err) {
      setError(err.message);
    }
  };

  const addCompetence = async (categoryId, newCompetence) => {
    try {
      const savedCompetence = await saveCompetence(categoryId, newCompetence);
      setCategories(prevCategories => 
        prevCategories.map(category => 
          category.id === categoryId
            ? { ...category, competences: [...category.competences, savedCompetence] }
            : category
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CompetencesContext.Provider value={{ 
      categories, 
      addCategory, 
      addCompetence, 
      isLoading, 
      error 
    }}>
      {children}
    </CompetencesContext.Provider>
  );
};

export const useCompetences = () => useContext(CompetencesContext);