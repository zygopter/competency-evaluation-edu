import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const StudentPage = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Page de l'élève</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bienvenue, élève ! Ici vous pouvez voir vos évaluations et remplir de nouvelles.</p>
          {/* Ajoutez ici plus de contenu pour la page de l'élève */}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPage;