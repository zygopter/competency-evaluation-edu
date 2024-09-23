import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompetences } from '../contexts/CompetencesContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from 'react-hot-toast';

const StudentFormFill = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { formulaires, categories, submitStudentFormById, getStudentPendingForms } = useCompetences();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});

    useEffect(() => {
        const loadForm = async () => {
            if (!user) return;

            try {
                const pendingForms = await getStudentPendingForms(user.id);
                console.log('Pending forms:', pendingForms);

                // Trouver le formulaire en attente correspondant à l'ID de l'URL
                const currentPendingForm = pendingForms.find(f => f.id.toString() === formId);
                console.log('Current pending form:', currentPendingForm);

                if (currentPendingForm) {
                    const formDetails = formulaires.find(f => f.id === currentPendingForm.formId);
                    console.log('Form details:', formDetails);

                    if (formDetails) {
                        setForm({
                            ...currentPendingForm,
                            ...formDetails
                        });
                    } else {
                        console.error('Détails du formulaire non trouvés');
                        toast.error('Erreur lors du chargement des détails du formulaire');
                    }
                } else {
                    console.error('Formulaire en attente non trouvé');
                    toast.error('Formulaire non trouvé');
                }
            } catch (error) {
                console.error('Erreur lors du chargement du formulaire:', error);
                toast.error('Erreur lors du chargement du formulaire');
            }
        };

        loadForm();
    }, [user, formId, formulaires, getStudentPendingForms]);

    const handleSubmit = async () => {
        if (!user || !form) return;

        try {
            await submitStudentFormById(form.id, user.id, responses);
            toast.success("Formulaire soumis avec succès");
            navigate('/student');
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            toast.error("Erreur lors de la soumission du formulaire");
        }
    };

    const handleGoBack = () => {
        navigate('/student'); // Retour à la page d'accueil de l'étudiant
    };

    if (!form) return <div>Chargement du formulaire...</div>;

    const findCompetence = (compId) => {
        for (let category of categories) {
            const comp = category.competences.find(c => c.id === compId);
            if (comp) return comp;
        }
        return null;
    };

    return (
        <div className="container mx-auto p-4">
            <Button onClick={handleGoBack} variant="outline">
                Retour
            </Button>
            <h2 className="text-2xl font-bold mb-4">{form.title}</h2>
            {form.competences.map(compId => {
                const competence = findCompetence(compId);
                if (!competence) return null;
                return (
                    <Card key={compId} className="mb-4">
                        <CardHeader>
                            <CardTitle>{competence.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                onValueChange={(value) => setResponses({ ...responses, [compId]: value })}
                                value={responses[compId] || ''}
                            >
                                {['A', 'B', 'C', 'D'].map(value => (
                                    <div key={value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={value} id={`${compId}-${value}`} />
                                        <Label htmlFor={`${compId}-${value}`}>{value}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                );
            })}
            <Button onClick={handleSubmit}>Soumettre le formulaire</Button>
        </div>
    );
};

export default StudentFormFill;