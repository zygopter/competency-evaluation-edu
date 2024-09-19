import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";

const initialCategories = [
  {
    id: 1,
    name: "PRATIQUER DES DEMARCHES SCIENTIFIQUES",
    description: "Cette catégorie regroupe les compétences liées à la méthode scientifique.",
    competences: [
      {
        id: 1,
        name: "Formuler et résoudre une question ou un problème scientifique",
        description: "Capacité à identifier, formuler et résoudre des problèmes scientifiques."
      },
      {
        id: 2,
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
        id: 1,
        name: "Préparation microscopique",
        description: "Description de la compétence."
      },
      {
        id: 2,
        name: "Dissection",
        description: "Description de la compétence."
      }
    ]
  }
];

const CompetencesTab = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newCompetence, setNewCompetence] = useState({ name: '', description: '', categoryId: null });

  const handleAddCategory = () => {
    if (newCategory.name) {
      setCategories([...categories, { ...newCategory, id: Date.now(), competences: [] }]);
      setNewCategory({ name: '', description: '' });
    }
  };

  const handleAddCompetence = () => {
    if (newCompetence.name && newCompetence.categoryId) {
      setCategories(categories.map(category => 
        category.id === newCompetence.categoryId
          ? { ...category, competences: [...category.competences, { ...newCompetence, id: Date.now() }] }
          : category
      ));
      setNewCompetence({ name: '', description: '', categoryId: null });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des compétences</h2>
      
      {/* Formulaire d'ajout de catégorie */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ajouter une nouvelle catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            className="mb-2"
            placeholder="Nom de la catégorie"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <Textarea
            className="mb-2"
            placeholder="Description de la catégorie"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <Button onClick={handleAddCategory}>Ajouter la catégorie</Button>
        </CardContent>
      </Card>

      {/* Liste des catégories et compétences */}
      <Accordion type="single" collapsible className="w-full">
        {categories.map((category) => (
          <AccordionItem key={category.id} value={`category-${category.id}`}>
            <AccordionTrigger>{category.name}</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">{category.description}</p>
              <ul className="list-disc pl-5 mb-4">
                {category.competences.map((competence) => (
                  <li key={competence.id}>
                    <strong>{competence.name}</strong>: {competence.description}
                  </li>
                ))}
              </ul>
              
              {/* Formulaire d'ajout de compétence */}
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter une nouvelle compétence</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    className="mb-2"
                    placeholder="Nom de la compétence"
                    value={newCompetence.name}
                    onChange={(e) => setNewCompetence({ ...newCompetence, name: e.target.value, categoryId: category.id })}
                  />
                  <Textarea
                    className="mb-2"
                    placeholder="Description de la compétence"
                    value={newCompetence.description}
                    onChange={(e) => setNewCompetence({ ...newCompetence, description: e.target.value, categoryId: category.id })}
                  />
                  <Button onClick={handleAddCompetence}>Ajouter la compétence</Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CompetencesTab;