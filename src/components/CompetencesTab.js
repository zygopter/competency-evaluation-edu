import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Spinner } from "./ui/spinner";
import { useCompetences } from '../contexts/CompetencesContext';


const CompetencesTab = () => {
  const { categories, addCategory, addCompetence, isLoading, error } = useCompetences();
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newCompetence, setNewCompetence] = useState({ name: '', description: '', categoryId: null });

  const handleAddCategory = async () => {
    if (newCategory.name) {
      await addCategory(newCategory);
      setNewCategory({ name: '', description: '' });
    }
  };

  const handleAddCompetence = async () => {
    if (newCompetence.name && newCompetence.categoryId) {
      await addCompetence(newCompetence.categoryId, newCompetence);
      setNewCompetence({ name: '', description: '', categoryId: null });
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Erreur : {error}</div>;

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