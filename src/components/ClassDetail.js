import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useCompetences } from './../contexts/CompetencesContext';
import { Spinner } from "./ui/spinner";

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { categories, formulaires } = useCompetences();
  const [classDetails, setClassDetails] = useState(null);
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    // Simulons le chargement des détails de la classe
    const loadClassDetails = async () => {
      // Dans une vraie application, ceci serait un appel API
      const mockClassDetails = {
        id: classId,
        name: "6ème A",
        year: "2023-2024",
        students: [
          { id: 1, firstName: "Jean", lastName: "Dupont", evaluations: { 1: 'A', 2: 'B', 3: 'C' } },
          { id: 2, firstName: "Marie", lastName: "Martin", evaluations: { 1: 'B', 2: 'A', 3: 'B' } },
        ]
      };
      setClassDetails(mockClassDetails);
    };
    loadClassDetails();
  }, [classId]);

  const handleAddStudent = () => {
    if (newStudent.firstName && newStudent.lastName) {
      setClassDetails({
        ...classDetails,
        students: [...classDetails.students, { id: Date.now(), ...newStudent, evaluations: {} }]
      });
      setNewStudent({ firstName: '', lastName: '' });
    }
  };

  if (!classDetails) return <Spinner />;

  const allCompetences = categories.flatMap(category => category.competences);

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => navigate('/teacher/classes')} className="mb-4">Retour aux classes</Button>
      <h2 className="text-2xl font-bold mb-4">{classDetails.name} - {classDetails.year}</h2>
      
      {/* Formulaire d'ajout d'élève */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ajouter un nouvel élève</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Prénom"
              value={newStudent.firstName}
              onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
            />
            <Input
              placeholder="Nom"
              value={newStudent.lastName}
              onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
            />
            <Button onClick={handleAddStudent}>Ajouter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des élèves et leurs évaluations */}
      <Card>
        <CardHeader>
          <CardTitle>Évaluations des élèves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2}>Nom</TableHead>
                  <TableHead rowSpan={2}>Prénom</TableHead>
                  {categories.map(category => (
                    <TableHead key={category.id} colSpan={category.competences.length} className="text-center">
                      {category.name}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow>
                  {categories.map(category => 
                    category.competences.map(comp => (
                      <TableHead key={comp.id} className="text-sm">
                        {comp.name}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {classDetails.students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.firstName}</TableCell>
                    {categories.map(category => 
                      category.competences.map(comp => (
                        <TableCell key={comp.id} className="text-center">
                          {student.evaluations[comp.id] || '-'}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassDetail;