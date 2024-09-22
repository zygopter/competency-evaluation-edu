import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";


const ClassesTab = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([
    { id: 1, name: "6ème A", year: "2023-2024" },
    { id: 2, name: "5ème B", year: "2023-2024" },
  ]);
  const [newClass, setNewClass] = useState({ name: '', year: '' });

  const handleAddClass = () => {
    if (newClass.name && newClass.year) {
      const newClassWithId = { id: Date.now(), ...newClass };
      setClasses([...classes, newClassWithId]);
      setNewClass({ name: '', year: '' });
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/teacher/classes/${classId}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des classes</h2>
      
      {/* Formulaire d'ajout de classe */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ajouter une nouvelle classe</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            className="mb-2"
            placeholder="Nom de la classe"
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          />
          <Input
            className="mb-2"
            placeholder="Année scolaire"
            value={newClass.year}
            onChange={(e) => setNewClass({ ...newClass, year: e.target.value })}
          />
          <Button onClick={handleAddClass}>Ajouter la classe</Button>
        </CardContent>
      </Card>

      {/* Liste des classes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleClassClick(cls.id)}>
            <CardHeader>
              <CardTitle>{cls.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Année scolaire : {cls.year}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassesTab;