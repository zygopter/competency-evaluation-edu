import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CompetencesTab = () => {
  const [competences, setCompetences] = useState([
    { id: 1, name: "Analyser et résoudre des problèmes", category: "Résolution de problèmes" },
    { id: 2, name: "Communiquer efficacement", category: "Communication" },
    // Ajoutez d'autres compétences ici
  ]);
  const [newCompetence, setNewCompetence] = useState({ name: '', category: '' });

  const handleAddCompetence = () => {
    if (newCompetence.name && newCompetence.category) {
      setCompetences([...competences, { id: Date.now(), ...newCompetence }]);
      setNewCompetence({ name: '', category: '' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des compétences</h2>
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Nom de la compétence"
          value={newCompetence.name}
          onChange={(e) => setNewCompetence({ ...newCompetence, name: e.target.value })}
        />
        <Input
          placeholder="Catégorie"
          value={newCompetence.category}
          onChange={(e) => setNewCompetence({ ...newCompetence, category: e.target.value })}
        />
        <Button onClick={handleAddCompetence}>Ajouter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competences.map((competence) => (
            <TableRow key={competence.id}>
              <TableCell>{competence.name}</TableCell>
              <TableCell>{competence.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompetencesTab;