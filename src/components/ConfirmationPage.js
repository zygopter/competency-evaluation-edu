import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Merci pour vos réponses</h1>
      <p className="mb-4">Votre auto-évaluation a été enregistrée avec succès.</p>
      <Button onClick={() => navigate('/teacher/formulaires')}>Retour aux formulaires</Button>
    </div>
  );
};

export default ConfirmationPage;