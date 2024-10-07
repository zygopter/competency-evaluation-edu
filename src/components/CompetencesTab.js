import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Spinner } from "./ui/spinner";
import { useCompetences } from '../contexts/CompetencesContext';
import toast from 'react-hot-toast';


const CompetencesTab = () => {
  const { categories, addCategory, updateCategoryById,
    deleteCategoryById, addCompetence, updateCompetenceById, deleteCompetenceById, isLoading, error } = useCompetences();
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newCompetence, setNewCompetence] = useState({ name: '', description: '', categoryId: null });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCompetence, setEditingCompetence] = useState(null);

  const handleAddCategory = async () => {
    if (newCategory.name) {
      try {
        await addCategory(newCategory);
        setNewCategory({ name: '', description: '' });
        toast.success("Catégorie ajoutée avec succès");
      } catch (err) {
        toast.error(`Erreur lors de l'ajout de la catégorie: ${err.message}`);
      }
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      await updateCategoryById(id, editingCategory);
      setEditingCategory(null);
      toast.success("Catégorie mise à jour avec succès");
    } catch (err) {
      toast.error(`Erreur lors de la mise à jour de la catégorie: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategoryById(id);
      toast.success("Catégorie supprimée avec succès");
    } catch (err) {
      toast.error(`Erreur lors de la suppression de la catégorie: ${err.message}`);
    }
  };

  const handleAddCompetence = async (newCompetence) => {
    console.log('Adding competence:', newCompetence);
    if (newCompetence.name && newCompetence.categoryId) {
      try {
        await addCompetence(newCompetence);
        setNewCompetence({ name: '', description: '', categoryId: null });
        toast.success("Compétence ajoutée avec succès");
      } catch (err) {
        toast.error(`Erreur lors de l'ajout de la compétence: ${err.message}`);
      }
    }
  };

  const handleUpdateCompetence = async (id) => {
    try {
      await updateCompetenceById(id, editingCompetence);
      setEditingCompetence(null);
      toast.success("Compétence mise à jour avec succès");
    } catch (err) {
      toast.error(`Erreur lors de la mise à jour de la compétence: ${err.message}`);
    }
  };

  const handleDeleteCompetence = async (id, categoryId) => {
    try {
      await deleteCompetenceById(id, categoryId);
      toast.success("Compétence supprimée avec succès");
    } catch (err) {
      toast.error(`Erreur lors de la suppression de la compétence: ${err.message}`);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des compétences</h2>

      {/* Formulaire d'ajout de catégorie */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ajouter une nouvelle catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            className="mb-2"
            placeholder="Nom de la catégorie"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <Textarea
            className="mb-2"
            placeholder="Description de la catégorie"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <Button onClick={handleAddCategory}>Ajouter la catégorie</Button>
        </CardContent>
      </Card>

      {/* Liste des catégories et compétences */}
      <Accordion type="single" collapsible className="w-full">
        {categories && categories.length > 0 ? categories.map((category) => (
          <AccordionItem key={category._id} value={`category-${category._id}`}>
            <AccordionTrigger>{category.name}</AccordionTrigger>
            <AccordionContent>
              {editingCategory && editingCategory._id === category._id ? (
                <div>
                  <Input
                    className="mb-2"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                  <Textarea
                    className="mb-2"
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  />
                  <Button onClick={() => handleUpdateCategory(category._id)}>Sauvegarder</Button>
                  <Button onClick={() => setEditingCategory(null)}>Annuler</Button>
                </div>
              ) : (
                <div>
                  <p className="mb-2">{category.description}</p>
                  <Button onClick={() => setEditingCategory(category)}>Modifier</Button>
                  <Button className="ml-4" onClick={() => handleDeleteCategory(category._id)}>Supprimer</Button>
                </div>
              )}

              <h3 className="mt-4 mb-2 font-semibold">Compétences</h3>
              <ul className="list-disc pl-5 mb-4">
                {category.competences && category.competences.length > 0 ? (
                  category.competences.map((competence) => (
                    <li key={competence._id} className="mb-2">
                      {editingCompetence && editingCompetence._id === competence._id ? (
                        <div>
                          <Input
                            className="mb-2"
                            value={editingCompetence.name}
                            onChange={(e) => setEditingCompetence({ ...editingCompetence, name: e.target.value })}
                          />
                          <Textarea
                            className="mb-2"
                            value={editingCompetence.description}
                            onChange={(e) => setEditingCompetence({ ...editingCompetence, description: e.target.value })}
                          />
                          <Button onClick={() => handleUpdateCompetence(competence._id)}>Sauvegarder</Button>
                          <Button onClick={() => setEditingCompetence(null)}>Annuler</Button>
                        </div>
                      ) : (
                        <div>
                          <strong>{competence.name}</strong>: {competence.description}
                          <Button onClick={() => setEditingCompetence(competence)}>Modifier</Button>
                          <Button className="ml-4" onClick={() => handleDeleteCompetence(competence._id, category._id)}>Supprimer</Button>
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <li>Aucune compétence pour cette catégorie.</li>
                )}
              </ul>

              {/* Formulaire d'ajout de compétence */}
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter une nouvelle compétence</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    className="mb-2"
                    placeholder="Nom de la compétence"
                    value={newCompetence.name}
                    onChange={(e) => setNewCompetence({ ...newCompetence, name: e.target.value, categoryId: category._id })}
                  />
                  <Textarea
                    className="mb-2"
                    placeholder="Description de la compétence"
                    value={newCompetence.description}
                    onChange={(e) => setNewCompetence({ ...newCompetence, description: e.target.value, categoryId: category._id })}
                  />
                  <Button onClick={() => handleAddCompetence(newCompetence)}>Ajouter la compétence</Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        )) : (
          <p>Aucune catégorie trouvée.</p>
        )}
      </Accordion>
    </div>
  );
};

export default CompetencesTab;