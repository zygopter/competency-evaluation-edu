import axios from "axios";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Fonctions d'authentification
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API login error:', error.response ? error.response.data : error.message);
        throw error.response.data;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const mockDatabase = {
    categories: [
        {
            id: 1,
            name: "PRATIQUER DES DEMARCHES SCIENTIFIQUES",
            description: "Cette catégorie regroupe les compétences liées à la méthode scientifique.",
            competences: [
                {
                    id: 11,
                    name: "Formuler et résoudre une question ou un problème scientifique",
                    description: "Capacité à identifier, formuler et résoudre des problèmes scientifiques."
                },
                {
                    id: 12,
                    name: "Concevoir une stratégie de résolution d'un problème",
                    description: "Aptitude à planifier et mettre en œuvre une approche pour résoudre un problème scientifique."
                }
            ]
        },
        {
            id: 2,
            name: "REALISER",
            description: "Cette catégorie regroupe les compétences liées à la réalisation pratique.",
            competences: [
                {
                    id: 21,
                    name: "Préparation microscopique",
                    description: "Description de la compétence."
                },
                {
                    id: 22,
                    name: "Dissection",
                    description: "Description de la compétence."
                }
            ]
        }
    ],
    formulaires: [
        { id: 1, title: 'Évaluation de mi-trimestre', competences: [11, 12, 21] },
        { id: 2, title: 'Évaluation de fin d\'année', competences: [11, 12, 21, 22] }
    ],
    classes: [
        {
            id: 1,
            name: "6ème A",
            year: "2023-2024",
            students: [
                {
                    id: 101,
                    firstName: "Jean",
                    lastName: "Dupont",
                    evaluations: { 11: 'A', 12: 'B', 21: 'C', 22: 'B' }
                },
                {
                    id: 102,
                    firstName: "Marie",
                    lastName: "Martin",
                    evaluations: { 11: 'B', 12: 'A', 21: 'B', 22: 'C' }
                }
            ]
        },
        {
            id: 2,
            name: "5ème B",
            year: "2023-2024",
            students: [
                { id: 201, firstName: "Jean", lastName: "Dupont", evaluations: { 11: 'A', 12: 'B', 22: 'C' } },
                { id: 202, firstName: "Marie", lastName: "Martin", evaluations: { 11: 'B', 12: 'A', 21: 'B' } },
            ]
        },
    ],
    pendingForms: [],
};


////////////////// COMPETENCES /////////////////////////////////////////
export const fetchCategories = async () => {
    try {
        const response = await api.get('/categories');
        console.log('Récupération des catégories:', response);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        throw new Error('Failed to fetch categories');
    }
};

export const saveCategory = async (categoryData) => {
    try {
        const response = await api.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        throw new Error('Failed to create category');
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la modification de la catégorie:', error);
        throw new Error('Failed to update category');
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        throw new Error('Failed to delete category');
    }
};

export const fetchCompetences = async () => {
    try {
        const response = await api.get('/competences');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch competences');
    }
};

export const saveCompetence = async (competenceData) => {
    try {
        const response = await api.post('/competences', competenceData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create competence');
    }
};

export const updateCompetence = async (id, competenceData) => {
    try {
        const response = await api.put(`/competences/${id}`, competenceData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update competence');
    }
};

export const deleteCompetence = async (id) => {
    try {
        const response = await api.delete(`/competences/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete competence');
    }
};

export const fetchCompetencesByCategory = async (categoryId) => {
    try {
        const response = await api.get(`/categories/${categoryId}/competences`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch competences for category');
    }
};

export const mockFetchCategories = async () => {
    await delay(500); // Simuler un délai réseau
    return mockDatabase.categories;
};

export const mockSaveCategory = async (newCategory) => {
    await delay(500);
    const category = { ...newCategory, id: Date.now() };
    mockDatabase.categories.push(category);
    return category;
};

export const mockSaveCompetence = async (categoryId, newCompetence) => {
    await delay(500);
    const category = mockDatabase.categories.find(c => c.id === categoryId);
    if (!category) throw new Error("Catégorie non trouvée");
    const competence = { ...newCompetence, id: Date.now() };
    category.competences.push(competence);
    return competence;
};

export const mockDeleteCompetence = async (categoryId, competenceId) => {
    await delay(500);
    const categoryIndex = mockDatabase.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
        const competenceIndex = mockDatabase.categories[categoryIndex].competences.findIndex(comp => comp.id === competenceId);
        if (competenceIndex !== -1) {
            mockDatabase.categories[categoryIndex].competences.splice(competenceIndex, 1);
            return true;
        }
    }
    throw new Error("Catégorie ou compétence non trouvée");
};

////////////////// FORMS /////////////////////////////////////////
export const fetchFormulaires = async () => {
    try {
        const response = await api.get('/formulaires');
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des formulaires');
    }
};

export const saveFormulaire = async (newFormulaire) => {
    try {
        const response = await api.post('/formulaires', newFormulaire);
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la création du formulaire');
    }
};

export const updateFormulaire = async (id, updatedFormulaire) => {
    try {
        const response = await api.put(`/formulaires/${id}`, updatedFormulaire);
        return response.data;
    } catch (error) {
        throw new Error('Erreur lors de la mise à jour du formulaire');
    }
};

export const deleteFormulaire = async (id) => {
    try {
        await api.delete(`/formulaires/${id}`);
        return true;
    } catch (error) {
        throw new Error('Erreur lors de la suppression du formulaire');
    }
};

export const mockFetchFormulaires = async () => {
    await delay(500);
    return mockDatabase.formulaires;
};

export const mockSaveFormulaire = async (newFormulaire) => {
    await delay(500);
    const formulaire = { ...newFormulaire, id: Date.now() };
    mockDatabase.formulaires.push(formulaire);
    return formulaire;
};

export const mockUpdateFormulaire = async (id, updatedFormulaire) => {
    await delay(500);
    const index = mockDatabase.formulaires.findIndex(f => f.id === id);
    if (index !== -1) {
        mockDatabase.formulaires[index] = { ...mockDatabase.formulaires[index], ...updatedFormulaire };
        return mockDatabase.formulaires[index];
    }
    throw new Error("Formulaire non trouvé");
};

export const mockDeleteFormulaire = async (id) => {
    await delay(500);
    const index = mockDatabase.formulaires.findIndex(f => f.id === id);
    if (index !== -1) {
        mockDatabase.formulaires.splice(index, 1);
        return true;
    }
    throw new Error("Formulaire non trouvé");
};

////////////////// CLASSES /////////////////////////////////////////
export const mockSaveClass = async (newClass) => {
    await delay(500);
    const classWithId = { ...newClass, id: Date.now(), students: [] };
    mockDatabase.classes.push(classWithId);
    return classWithId;
};

export const mockUpdateClass = async (id, updatedClass) => {
    await delay(500);
    const index = mockDatabase.classes.findIndex(c => c.id === id);
    if (index !== -1) {
        mockDatabase.classes[index] = { ...mockDatabase.classes[index], ...updatedClass };
        return mockDatabase.classes[index];
    }
    throw new Error("Classe non trouvée");
};

export const mockDeleteClass = async (id) => {
    await delay(500);
    const index = mockDatabase.classes.findIndex(c => c.id === id);
    if (index !== -1) {
        mockDatabase.classes.splice(index, 1);
        return true;
    }
    throw new Error("Classe non trouvée");
};

export const mockAddStudentToClass = async (classId, student) => {
    await delay(500);
    const classIndex = mockDatabase.classes.findIndex(c => c.id === classId);
    if (classIndex !== -1) {
        const newStudent = {
            ...student,
            id: Date.now(),
            evaluations: {} // Initialiser les évaluations comme un objet vide
        };
        mockDatabase.classes[classIndex].students.push(newStudent);
        return newStudent;
    }
    throw new Error("Classe non trouvée");
};

export const mockAddMultipleStudentsToClassAPI = async (classId, students) => {
    await delay(500);
    const classIndex = mockDatabase.classes.findIndex(c => c.id === classId);
    if (classIndex !== -1) {
        const newStudents = students.map(student => ({
            ...student,
            id: Date.now() + Math.random(), // Simuler des IDs uniques
            evaluations: {}
        }));
        mockDatabase.classes[classIndex].students.push(...newStudents);
        return mockDatabase.classes[classIndex];
    }
    throw new Error("Classe non trouvée");
};

export const fetchClasses = async () => {
    try {
        const response = await api.get('/classes');
        console.log('Récupération des classes:', response);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des classes:', error);
        throw error.response ? error.response.data : error;
    }
};

export const saveClass = async (newClass) => {
    try {
        const response = await api.post('/classes', newClass);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la classe:', error);
        throw error.response ? error.response.data : error;
    }
};

export const updateClass = async (classId, updatedClass) => {
    try {
        const response = await api.put(`/classes/${classId}`, updatedClass);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la classe:', error);
        throw error.response ? error.response.data : error;
    }
};

export const deleteClass = async (classId) => {
    try {
        await api.delete(`/classes/${classId}`);
    } catch (error) {
        console.error('Erreur lors de la suppression de la classe:', error);
        throw error.response ? error.response.data : error;
    }
};

export const getClassDetails = async (classId) => {
    try {
        const response = await api.get(`/classes/${classId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur API lors de la récupération des détails de la classe:', error);
        throw error.response ? error.response.data : error;
    }
};

export const addStudentsToClass = async (classId, students) => {
    try {
        const response = await api.post(`/classes/${classId}/students`, { students });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'étudiants à la classe:', error);
        throw error.response ? error.response.data : error;
    }
};

export const getStudentsByClass = async (classId) => {
    try {
        const response = await api.get(`/classes/${classId}/students`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des étudiants de la classe:', error);
        throw error;
    }
};

export const generateClassCode = async (classId) => {
    try {
        const response = await api.post(`/classes/${classId}/generate-code`);
        return response.data.code;
    } catch (error) {
        console.error('Erreur lors de la génération du code de classe:', error);
        throw error.response ? error.response.data : error;
    }
};

export const getStudentsByClassCode = async (classCode) => {
    try {
        const response = await api.get(`/classes/students-by-code/${classCode}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des étudiants de la classe:', error);
        throw error.response ? error.response.data : error;
    }
};

export const searchStudentsInClass = async (classCode, lastNamePrefix) => {
    try {
        const response = await api.get(`/classes/search-students`, { params: { classCode, lastNamePrefix } });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des étudiants de la classe:', error);
        throw error.response ? error.response.data : error;
    }
};

export const joinClass = async (classCode, firstName, lastName) => {
    try {
        const response = await api.post('/classes/join', { classCode, firstName, lastName });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la tentative de rejoindre la classe:', error);
        throw error.response ? error.response.data : error;
    }
};

export const mockFetchClasses = async () => {
    await delay(500);
    return mockDatabase.classes;
};

export const updateStudentEvaluation = async (classId, studentId, competenceId, value) => {
    await delay(500);
    const classIndex = mockDatabase.classes.findIndex(c => c.id === classId);
    if (classIndex !== -1) {
        const studentIndex = mockDatabase.classes[classIndex].students.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
            mockDatabase.classes[classIndex].students[studentIndex].evaluations[competenceId] = value;
            return mockDatabase.classes[classIndex].students[studentIndex];
        }
        throw new Error("Étudiant non trouvé");
    }
    throw new Error("Classe non trouvée");
};

export const sendFormToClass = async (classId, formId) => {
    await delay(500);
    const classData = mockDatabase.classes.find(c => c.id === classId);
    const form = mockDatabase.formulaires.find(f => f.id === formId);

    if (!classData || !form) throw new Error("Classe ou formulaire non trouvé");

    classData.students.forEach(student => {
        mockDatabase.pendingForms.push({
            id: Date.now() + Math.random(),
            studentId: student.id,
            title: form.title,
            classId,
            formId,
            status: 'pending'
        });
    });

    return { message: "Formulaire envoyé à tous les élèves de la classe" };
};

export const getPendingFormsForStudent = async (studentId) => {
    await delay(500);
    return mockDatabase.pendingForms.filter(f => f.studentId === studentId && f.status === 'pending');
};

export const submitStudentForm = async (formId, studentId, responses) => {
    await delay(500);
    const pendingFormIndex = mockDatabase.pendingForms.findIndex(
        f => f.id === formId && f.studentId === studentId
    );

    if (pendingFormIndex === -1) throw new Error("Formulaire non trouvé");

    mockDatabase.pendingForms[pendingFormIndex].status = 'completed';

    // Mise à jour des évaluations de l'étudiant
    const classId = mockDatabase.pendingForms[pendingFormIndex].classId;
    const classIndex = mockDatabase.classes.findIndex(c => c.id === classId);
    const studentIndex = mockDatabase.classes[classIndex].students.findIndex(s => s.id === studentId);

    mockDatabase.classes[classIndex].students[studentIndex].evaluations = {
        ...mockDatabase.classes[classIndex].students[studentIndex].evaluations,
        ...responses
    };

    return { message: "Formulaire soumis avec succès" };
};