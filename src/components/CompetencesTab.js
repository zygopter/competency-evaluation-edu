import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des compétences</h2>
      
      {/* Formulaire d'ajout de catégorie */}
      <Card>
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddCategory}>Ajouter la catégorie</Button>
        </CardFooter>
      </Card>

      {/* Liste des catégories et compétences */}
      {categories && categories.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-2">
          {categories.map((category) => (
            <AccordionItem key={category._id} value={`category-${category._id}`} className="border rounded-lg p-4">
              <AccordionTrigger className="text-lg font-semibold">{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 space-y-4">
                  {editingCategory && editingCategory._id === category._id ? (
                    <Card>
                      <CardContent className="pt-4">
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
                      </CardContent>
                      <CardFooter className="space-x-2">
                        <Button onClick={() => handleUpdateCategory(category._id)}>Sauvegarder</Button>
                        <Button variant="outline" onClick={() => setEditingCategory(null)}>Annuler</Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <div>
                      <p className="mb-2">{category.description}</p>
                      <div className="space-x-2">
                        <Button variant="outline" onClick={() => setEditingCategory(category)}>Modifier</Button>
                        <Button variant="destructive" onClick={() => handleDeleteCategory(category._id)}>Supprimer</Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">Compétences</h3>
                    {category.competences && category.competences.length > 0 ? (
                      <ul className="space-y-2">
                        {category.competences.map((competence) => (
                          <li key={competence._id} className="border rounded p-2">
                            {editingCompetence && editingCompetence._id === competence._id ? (
                              <Card>
                                <CardContent className="pt-4">
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
                                </CardContent>
                                <CardFooter className="space-x-2">
                                  <Button onClick={() => handleUpdateCompetence(competence._id)}>Sauvegarder</Button>
                                  <Button variant="outline" onClick={() => setEditingCompetence(null)}>Annuler</Button>
                                </CardFooter>
                              </Card>
                            ) : (
                              <div>
                                <strong>{competence.name}</strong>
                                <p className="mt-2 whitespace-pre-wrap">{competence.description}</p>
                                <div className="mt-2 space-x-2">
                                  <Button size="sm" variant="outline" onClick={() => setEditingCompetence(competence)}>Modifier</Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDeleteCompetence(competence._id, category._id)}>Supprimer</Button>
                                </div>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">Aucune compétence pour cette catégorie.</p>
                    )}
                  </div>
                  
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
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleAddCompetence(newCompetence)}>Ajouter la compétence</Button>
                    </CardFooter>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-gray-500 italic">Aucune catégorie trouvée.</p>
      )}
    </div>
  );
};

export default CompetencesTab;