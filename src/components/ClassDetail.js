import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useCompetences } from './../contexts/CompetencesContext';
import { Spinner } from "./ui/spinner";
import ImportStudents from './ImportStudents';
import toast from 'react-hot-toast';

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { categories, classes, formulaires, addStudentToClassById, updateStudentEvaluationById,
    sendFormToClassById, isLoading, error } = useCompetences();
  const [classDetails, setClassDetails] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const classData = classes.find(c => c.id.toString() === classId);
    if (classData) {
      setClassDetails(classData);
    }
  }, [classId, classes]);

  const handleAddStudent = async () => {
    if (newStudent.firstName && newStudent.lastName) {
      try {
        await addStudentToClassById(parseInt(classId), newStudent);
        setNewStudent({ firstName: '', lastName: '' });
        toast.success("Élève ajouté avec succès");
      } catch (error) {
        toast.error(`Erreur lors de l'ajout de l'élève : ${error.message}`);
      }
    }
  };

  const handleSendForm = async () => {
    if (!selectedFormId) {
      toast.error("Veuillez sélectionner un formulaire");
      return;
    }
    try {
      await sendFormToClassById(parseInt(classId), parseInt(selectedFormId));
      toast.success("Formulaire envoyé à tous les élèves de la classe");
    } catch (error) {
      toast.error(`Erreur lors de l'envoi du formulaire : ${error.message}`);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;
  if (!classDetails) return <div>Classe non trouvée</div>;

  const allCompetences = categories.flatMap(category => category.competences);

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => navigate('/teacher/classes')} className="mb-4">Retour aux classes</Button>
      <h2 className="text-2xl font-bold mb-4">{classDetails.name} - {classDetails.year}</h2>

      {/* Bouton pour afficher/masquer le formulaire d'import */}
      <Button onClick={() => setShowImport(!showImport)} className="mb-4">
        {showImport ? 'Masquer l\'import' : 'Importer des élèves'}
      </Button>

      {/* Formulaire d'import */}
      {showImport && (
        <ImportStudents 
          classId={parseInt(classId)} 
          onImportComplete={() => {
            setShowImport(false);
            // Vous pourriez ajouter ici une logique pour rafraîchir les données de la classe
          }}
        />
      )}
      
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

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Envoyer un formulaire à la classe</h3>
        <div className="flex items-center space-x-2">
          <Select onValueChange={setSelectedFormId} value={selectedFormId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner un formulaire" />
            </SelectTrigger>
            <SelectContent>
              {formulaires.map(form => (
                <SelectItem key={form.id} value={form.id.toString()}>{form.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSendForm}>Envoyer le formulaire</Button>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;