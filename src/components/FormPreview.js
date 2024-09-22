import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useCompetences } from './../contexts/CompetencesContext';

const FormPreview = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const { categories, formulaires } = useCompetences();
    const [responses, setResponses] = useState({});
  
    const formulaire = formulaires.find(f => f.id.toString() === formId);
    if (!formulaire) return <div>Formulaire non trouvé</div>;
  
    const allCompetences = categories.flatMap(category => category.competences);

    const handleResponseChange = (compId, value) => {
        setResponses(prev => ({ ...prev, [compId]: value }));
    };
    
    const handleSubmit = () => {
        // Ici, vous pourriez envoyer les réponses à un serveur dans une vraie application
        console.log('Réponses soumises:', responses);
        navigate('/confirmation');
    };

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => navigate(-1)} className="mb-4">Retour</Button>
      <h1 className="text-2xl font-bold mb-4">Prévisualisation : {formulaire.title}</h1>
      {formulaire.competences.map(compId => {
        const competence = allCompetences.find(c => c.id === compId);
        if (!competence) return null;
        return (
          <Card key={compId} className="mb-4">
            <CardHeader>
              <CardTitle>{competence.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={responses[compId] || ''}
                onValueChange={(value) => handleResponseChange(compId, value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="A" id={`A-${compId}`} />
                  <Label htmlFor={`A-${compId}`}>A - Maîtrisé</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B" id={`B-${compId}`} />
                  <Label htmlFor={`B-${compId}`}>B - Satisfaisant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="C" id={`C-${compId}`} />
                  <Label htmlFor={`C-${compId}`}>C - Commencé</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="D" id={`D-${compId}`} />
                  <Label htmlFor={`D-${compId}`}>D - Insuffisant</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}
      <Button onClick={handleSubmit} className="mt-4">Envoyer les réponses</Button>
    </div>
  );
};

export default FormPreview;