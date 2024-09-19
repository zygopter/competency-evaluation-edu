import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    // Ici, vous feriez normalement un appel API pour récupérer les détails de la classe
    // Pour cet exemple, nous allons simuler des données
    setClassDetails({
      id: classId,
      name: "6ème A",
      year: "2023-2024",
      students: [
        { id: 1, firstName: "Jean", lastName: "Dupont" },
        { id: 2, firstName: "Marie", lastName: "Martin" },
      ]
    });
  }, [classId]);

  const handleAddStudent = () => {
    if (newStudent.firstName && newStudent.lastName) {
      setClassDetails({
        ...classDetails,
        students: [...classDetails.students, { id: Date.now(), ...newStudent }]
      });
      setNewStudent({ firstName: '', lastName: '' });
    }
  };

  if (!classDetails) return <div>Chargement...</div>;

  return (
    <div>
      <Button onClick={() => navigate('/teacher/classes')} className="mb-4">Retour aux classes</Button>
      <h2 className="text-2xl font-semibold mb-4">{classDetails.name} - {classDetails.year}</h2>
      
      {/* Liste des élèves */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Liste des élèves</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {classDetails.students.map((student) => (
              <li key={student.id}>{student.firstName} {student.lastName}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout d'élève */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouvel élève</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            className="mb-2"
            placeholder="Prénom"
            value={newStudent.firstName}
            onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
          />
          <Input
            className="mb-2"
            placeholder="Nom"
            value={newStudent.lastName}
            onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
          />
          <Button onClick={handleAddStudent}>Ajouter l'élève</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassDetail;