import React, { useState, useEffect } from 'react';
import { useCompetences } from '../contexts/CompetencesContext';
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ studentId }) => {
    const [pendingForms, setPendingForms] = useState([]);
    const { getStudentPendingForms } = useCompetences();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPendingForms = async () => {
            try {
                const forms = await getStudentPendingForms(studentId);
                setPendingForms(forms);
            } catch (error) {
                console.error("Erreur lors de la récupération des formulaires en attente:", error);
            }
        };

        fetchPendingForms();
    }, [studentId, getStudentPendingForms]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Tableau de bord de l'étudiant</h2>
            <h3 className="text-xl font-semibold mb-2">Formulaires en attente</h3>
            {pendingForms.length === 0 ? (
                <p>Aucun formulaire en attente.</p>
            ) : (
                pendingForms.map(form => (
                    <Card key={form.id} className="mb-4">
                        <CardHeader>
                            <CardTitle>{form.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate(`/student/form/${form.id}`)}>
                                Remplir le formulaire
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};

export default StudentDashboard;