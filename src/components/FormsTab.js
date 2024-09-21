import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { useCompetences } from '../contexts/CompetencesContext';
import { Spinner } from "./ui/spinner";

const FormsTab = () => {
    const { categories, isLoading, error } = useCompetences();
    const [formulaires, setFormulaires] = useState([]);
    const [newFormulaire, setNewFormulaire] = useState({ title: '', competences: [] });  

  const handleAddFormulaire = () => {
    if (newFormulaire.title && newFormulaire.competences.length > 0) {
      setFormulaires([...formulaires, { id: Date.now(), ...newFormulaire }]);
      setNewFormulaire({ title: '', competences: [] });
    }
  };

  const handleCompetenceToggle = (competenceId) => {
    setNewFormulaire(prev => {
      const isSelected = prev.competences.includes(competenceId);
      if (isSelected) {
        return { ...prev, competences: prev.competences.filter(id => id !== competenceId) };
      } else {
        return { ...prev, competences: [...prev.competences, competenceId] };
      }
    });
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

  const allCompetences = categories.flatMap(category => category.competences);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des formulaires d'auto-évaluation</h2>
      
      {/* Formulaire de création */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Créer un nouveau formulaire</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            className="mb-2"
            placeholder="Titre du formulaire"
            value={newFormulaire.title}
            onChange={(e) => setNewFormulaire({ ...newFormulaire, title: e.target.value })}
          />
          <div className="mb-2">
            <h3 className="font-semibold mb-1">Sélectionner les compétences :</h3>
            {categories.map((category) => (
              <div key={category.id} className="mb-2">
                <h4 className="font-medium">{category.name}</h4>
                {category.competences.map((competence) => (
                  <div key={competence.id} className="flex items-center space-x-2 ml-4">
                    <Checkbox
                      id={`competence-${competence.id}`}
                      checked={newFormulaire.competences.includes(competence.id)}
                      onCheckedChange={() => handleCompetenceToggle(competence.id)}
                    />
                    <label htmlFor={`competence-${competence.id}`} className="text-sm">
                      {competence.name}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Button onClick={handleAddFormulaire}>Créer le formulaire</Button>
        </CardContent>
      </Card>

      {/* Liste des formulaires existants */}
      <h3 className="text-lg font-semibold mb-2">Formulaires existants</h3>
      {formulaires.length === 0 ? (
        <p>Aucun formulaire créé pour le moment.</p>
      ) : (
        formulaires.map((formulaire) => (
          <Card key={formulaire.id} className="mb-2">
            <CardHeader>
              <CardTitle>{formulaire.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-1">Compétences évaluées :</h4>
              <ul className="list-disc pl-5">
                {formulaire.competences.map((compId) => {
                  const competence = allCompetences.find(c => c.id === compId);
                  return competence ? (
                    <li key={compId} className="text-sm">
                      {competence.name}
                    </li>
                  ) : null;
                })}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default FormsTab;