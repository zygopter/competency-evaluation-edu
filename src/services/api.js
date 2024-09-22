const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    formulaires: []
};

export const fetchCategories = async () => {
    await delay(500); // Simuler un délai réseau
    return mockDatabase.categories;
};

export const saveCategory = async (newCategory) => {
    await delay(500);
    const category = { ...newCategory, id: Date.now() };
    mockDatabase.categories.push(category);
    return category;
};

export const saveCompetence = async (categoryId, newCompetence) => {
    await delay(500);
    const category = mockDatabase.categories.find(c => c.id === categoryId);
    if (!category) throw new Error("Catégorie non trouvée");
    const competence = { ...newCompetence, id: Date.now() };
    category.competences.push(competence);
    return competence;
};

export const deleteCompetence = async (categoryId, competenceId) => {
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

export const fetchFormulaires = async () => {
    await delay(500);
    return mockDatabase.formulaires;
};

export const saveFormulaire = async (newFormulaire) => {
    await delay(500);
    const formulaire = { ...newFormulaire, id: Date.now() };
    mockDatabase.formulaires.push(formulaire);
    return formulaire;
};

export const updateFormulaire = async (id, updatedFormulaire) => {
    await delay(500);
    const index = mockDatabase.formulaires.findIndex(f => f.id === id);
    if (index !== -1) {
        mockDatabase.formulaires[index] = { ...mockDatabase.formulaires[index], ...updatedFormulaire };
        return mockDatabase.formulaires[index];
    }
    throw new Error("Formulaire non trouvé");
};

export const deleteFormulaire = async (id) => {
    await delay(500);
    const index = mockDatabase.formulaires.findIndex(f => f.id === id);
    if (index !== -1) {
        mockDatabase.formulaires.splice(index, 1);
        return true;
    }
    throw new Error("Formulaire non trouvé");
};