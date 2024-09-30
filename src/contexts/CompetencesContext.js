import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    fetchCategories, saveCategory, saveCompetence, deleteCompetence,
    fetchFormulaires, saveFormulaire, updateFormulaire, deleteFormulaire,
    fetchClasses, saveClass, updateClass, deleteClass, getClassDetails, addStudentsToClass,
    getStudentsByClass, searchStudentsInClass,
    generateClassCode, getStudentsByClassCode, joinClass,
    updateStudentEvaluation,
    sendFormToClass, getPendingFormsForStudent, submitStudentForm
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
            setClasses(prev => prev.map(c => c._id === id ? updated : c));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteClassById = async (id) => {
        try {
            await deleteClass(id);
            setClasses(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const fetchClassDetails = async (classId) => {
        try {
            return await getClassDetails(classId);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addStudentToClassById = async (classId, student) => {
        try {
            const updatedClass = await addStudentsToClass(classId, [student]);
            setClasses(prev => prev.map(c => c._id === classId ? updatedClass : c));
            return updatedClass;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addStudentsToClassById = async (classId, students) => {
        try {
            const updatedClass = await addStudentsToClass(classId, students);
            setClasses(prev => prev.map(c => c._id === classId ? updatedClass : c));
            return updatedClass;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const getStudentsByClassId = async (classId) => {
        try {
            return await getStudentsByClass(classId);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const generateClassCodeById = async (classId) => {
        try {
            const newCode = await generateClassCode(classId);
            setClasses(prev => prev.map(c =>
                c._id === classId ? { ...c, code: newCode } : c
            ));
            return newCode;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const getClassStudentsByCode = async (classCode) => {
        try {
            return await getStudentsByClassCode(classCode);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const searchStudentsInClassByCode = async (classCode, lastNamePrefix) => {
        try {
            const students = await searchStudentsInClass(classCode, lastNamePrefix);
            return students;
        } catch (error) {
            console.error("Erreur lors de la recherche d'élèves:", error);
            throw error;
        }
    };

    const joinClassByCode = async (classCode, firstName, lastName) => {
        try {
            return await joinClass(classCode, firstName, lastName);
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

    const sendFormToClassById = async (classId, formId) => {
        try {
            await sendFormToClass(classId, formId);
            // Vous pourriez mettre à jour l'état ici si nécessaire
        } catch (err) {
            console.error("Erreur lors de l'envoi du formulaire à la classe:", err);
            throw err;
        }
    };

    const getStudentPendingForms = async (studentId) => {
        try {
            return await getPendingFormsForStudent(studentId);
        } catch (err) {
            console.error("Erreur lors de la récupération des formulaires en attente:", err);
            throw err;
        }
    };

    const submitStudentFormById = async (formId, studentId, responses) => {
        try {
            await submitStudentForm(formId, studentId, responses);
            // Mettre à jour l'état des classes si nécessaire
        } catch (err) {
            console.error("Erreur lors de la soumission du formulaire étudiant:", err);
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
            addStudentsToClassById,
            getStudentsByClassId,
            getClassStudentsByCode,
            searchStudentsInClassByCode,
            joinClassByCode,
            generateClassCodeById,
            fetchClassDetails,
            updateStudentEvaluationById,
            sendFormToClassById,
            getStudentPendingForms,
            submitStudentFormById,
            isLoading,
            error
        }}>
            {children}
        </CompetencesContext.Provider>
    );
};

export const useCompetences = () => useContext(CompetencesContext);