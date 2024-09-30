import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Spinner } from "./ui/spinner";
import { useCompetences } from '../contexts/CompetencesContext';
import toast from 'react-hot-toast';


const ClassesTab = () => {
  const navigate = useNavigate();
  const { classes, addClass, deleteClassById, isLoading, error } = useCompetences();
  const [newClass, setNewClass] = useState({ name: '', year: '' });
  const [localClasses, setLocalClasses] = useState([]);

  useEffect(() => {
    setLocalClasses(classes);
  }, [classes]);

  useEffect(() => {
    console.log('localClasses updated:', localClasses);
  }, [localClasses]);

  const handleAddClass = async () => {
    if (newClass.name && newClass.year) {
      try {
        const addedClass = await addClass(newClass);
        setLocalClasses(prevClasses => [...prevClasses, addedClass]);
        setNewClass({ name: '', year: '' });
        toast.success("Classe ajoutée avec succès");
      } catch (error) {
        toast.error(`Erreur lors de l'ajout de la classe : ${error.message}`);
      }
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await deleteClassById(id);
      setLocalClasses(prevClasses => prevClasses.filter(cls => cls.id !== id));
      toast.success("Classe supprimée avec succès");
    } catch (error) {
      toast.error(`Erreur lors de la suppression de la classe : ${error.message}`);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

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
      {localClasses && localClasses.length > 0 ? (
        localClasses.map((cls) => (
          <Card key={cls._id} className="mb-2">
            <CardHeader>
              <CardTitle>{cls.name} - {cls.year}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Nombre d'élèves : {cls.students ? cls.students.length : 0}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate(`/teacher/classes/${cls._id}`)} className="mr-2">
                Voir les détails
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteClass(cls._id)}>
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>Aucune classe n'a été créée pour le moment.</p>
      )}
    </div>
  );
};

export default ClassesTab;