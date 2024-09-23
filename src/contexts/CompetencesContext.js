import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    fetchCategories, saveCategory, saveCompetence, deleteCompetence,
    fetchFormulaires, saveFormulaire, updateFormulaire, deleteFormulaire,
    fetchClasses, saveClass, updateClass, deleteClass, addStudentToClass, updateStudentEvaluation
} from '../services/api';

const CompetencesContext = createContext();

export const CompetencesProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [formulaires, setFormulaires] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const [categoriesData, classesData, formulairesData] = await Promise.all([
                    fetchCategories(),
                    fetchClasses(),
                    fetchFormulaires()
                ]);
                setCategories(categoriesData);
                setClasses(classesData);
                setFormulaires(formulairesData);
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

    const removeCompetence = async (categoryId, competenceId) => {
        try {
            await deleteCompetence(categoryId, competenceId);
            setCategories(prevCategories =>
                prevCategories.map(category =>
                    category.id === categoryId
                        ? { ...category, competences: category.competences.filter(comp => comp.id !== competenceId) }
                        : category
                )
            );
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addFormulaire = async (newFormulaire) => {
        try {
            const savedFormulaire = await saveFormulaire(newFormulaire);
            setFormulaires(prev => [...prev, savedFormulaire]);
            return savedFormulaire;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateFormulaireById = async (id, updatedFormulaire) => {
        try {
            const updated = await updateFormulaire(id, updatedFormulaire);
            setFormulaires(prev => prev.map(f => f.id === id ? updated : f));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteFormulaireById = async (id) => {
        try {
            await deleteFormulaire(id);
            setFormulaires(prev => prev.filter(f => f.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addClass = async (newClass) => {
        try {
            const savedClass = await saveClass(newClass);
            setClasses(prevClasses => [...prevClasses, savedClass]);
            return savedClass;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateClassById = async (id, updatedClass) => {
        try {
            const updated = await updateClass(id, updatedClass);
            setClasses(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteClassById = async (id) => {
        try {
            await deleteClass(id);
            setClasses(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addStudentToClassById = async (classId, student) => {
        try {
            const newStudent = await addStudentToClass(classId, student);
            setClasses(prev => prev.map(c =>
                c.id === classId
                    ? { ...c, students: [...c.students, newStudent] }
                    : c
            ));
            return newStudent;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateStudentEvaluationById = async (classId, studentId, competenceId, value) => {
        try {
            const updatedStudent = await updateStudentEvaluation(classId, studentId, competenceId, value);
            setClasses(prev => prev.map(c =>
                c.id === classId
                    ? {
                        ...c,
                        students: c.students.map(s =>
                            s.id === studentId ? updatedStudent : s
                        )
                    }
                    : c
            ));
            return updatedStudent;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };


    return (
        <CompetencesContext.Provider value={{
            categories,
            formulaires,
            classes,
            addCategory,
            addCompetence,
            removeCompetence,
            addFormulaire,
            updateFormulaireById,
            deleteFormulaireById,
            addClass,
            updateClassById,
            deleteClassById,
            addStudentToClassById,
            updateStudentEvaluationById,
            isLoading,
            error
        }}>
            {children}
        </CompetencesContext.Provider>
    );
};

export const useCompetences = () => useContext(CompetencesContext);