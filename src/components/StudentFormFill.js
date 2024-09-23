import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompetences } from '../contexts/CompetencesContext';
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from 'react-hot-toast';

const StudentFormFill = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const { formulaires, submitStudentFormById } = useCompetences();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});

    useEffect(() => {
        const currentForm = formulaires.find(f => f.id.toString() === formId);
        if (currentForm) {
            setForm(currentForm);
        }
    }, [formId, formulaires]);

    const handleSubmit = async () => {
        try {
            await submitStudentFormById(parseInt(formId), /* studentId */, responses);
            toast.success("Formulaire soumis avec succès");
            navigate('/student/dashboard');
        } catch (error) {
            toast.error(`Erreur lors de la soumission du formulaire : ${error.message}`);
        }
    };

    if (!form) return <div>Chargement du formulaire...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{form.title}</h2>
            {form.competences.map(compId => {
                const competence = /* trouver la compétence correspondante */;
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