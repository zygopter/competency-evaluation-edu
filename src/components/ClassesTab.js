import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const ClassesTab = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: "6ème A", year: "2023-2024" },
    { id: 2, name: "5ème B", year: "2023-2024" },
  ]);
  const [newClass, setNewClass] = useState({ name: '', year: '' });

  const handleAddClass = () => {
    if (newClass.name && newClass.year) {
      setClasses([...classes, { id: Date.now(), ...newClass }]);
      setNewClass({ name: '', year: '' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des classes</h2>
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Nom de la classe"
          value={newClass.name}
          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
        />
        <Input
          placeholder="Année scolaire"
          value={newClass.year}
          onChange={(e) => setNewClass({ ...newClass, year: e.target.value })}
        />
        <Button onClick={handleAddClass}>Ajouter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Année scolaire</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classe) => (
            <TableRow key={classe.id}>
              <TableCell>{classe.name}</TableCell>
              <TableCell>{classe.year}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClassesTab;