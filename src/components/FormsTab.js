import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { useCompetences } from '../contexts/CompetencesContext';
import { Spinner } from "./ui/spinner";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const FormsTab = () => {
  const navigate = useNavigate();
  const { categories, formulaires, addFormulaire, deleteFormulaireById, isLoading, error } = useCompetences();
  const [newFormulaire, setNewFormulaire] = useState({ title: '', competences: [] });

  const handleAddFormulaire = async () => {
    if (!newFormulaire.title.trim()) {
      toast.error("Veuillez saisir un titre pour le formulaire.");
      return;
    }
    if (newFormulaire.competences.length === 0) {
      toast.error("Veuillez sélectionner au moins une compétence.");
      return;
    }
    try {
      await addFormulaire(newFormulaire);
      setNewFormulaire({ title: '', competences: [] });
      toast.success("Formulaire créé avec succès !");
    } catch (error) {
      toast.error(`Erreur lors de la création du formulaire : ${error.message}`);
    }
  };

  const handleDeleteFormulaire = async (id) => {
    try {
      await deleteFormulaireById(id);
      toast.success("Formulaire supprimé avec succès !");
    } catch (error) {
      toast.error(`Erreur lors de la suppression du formulaire : ${error.message}`);
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
  
    const handlePreview = (formId) => {
      navigate(`/teacher/formulaires/preview/${formId}`);
    };

  if (isLoading) return <Spinner />;
  if (error) {
    toast.error(`Erreur de chargement des données : ${error}`);
    return <div className="text-red-500">Erreur de chargement. Veuillez réessayer plus tard.</div>;
  }

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
            <CardFooter>
              <Button onClick={() => handlePreview(formulaire.id)} className="mr-2">Prévisualiser</Button>
              <Button variant="destructive" onClick={() => handleDeleteFormulaire(formulaire.id)}>Supprimer</Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default FormsTab;