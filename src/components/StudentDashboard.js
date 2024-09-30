import React, { useState, useEffect } from 'react';
import { useCompetences } from '../contexts/CompetencesContext';
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentDashboard = ({ studentId }) => {
    const [pendingForms, setPendingForms] = useState([]);
    const [classes, setClasses] = useState([]);
    const [classCode, setClassCode] = useState('');
    const [lastNamePrefix, setLastNamePrefix] = useState('');
    const { getStudentPendingForms, getStudentClasses, joinClass } = useCompetences();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [forms, studentClasses] = await Promise.all([
                    getStudentPendingForms(studentId),
                    getStudentClasses(studentId)
                ]);
                setPendingForms(forms);
                setClasses(studentClasses);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
                toast.error("Erreur lors du chargement des données");
            }
        };

        fetchData();
    }, [studentId, getStudentPendingForms, getStudentClasses]);

    const handleJoinClass = async () => {
        if (!classCode.trim() || !lastNamePrefix.trim()) {
            toast.error("Veuillez entrer le code de la classe et les 3 premières lettres de votre nom de famille");
            return;
        }
        try {
            await joinClass(user.id, classCode, lastNamePrefix);
            const updatedClasses = await getStudentClasses(user.id);
            setClasses(updatedClasses);
            setClassCode('');
            setLastNamePrefix('');
            toast.success("Vous avez rejoint la classe avec succès");
        } catch (error) {
            console.error("Erreur lors de la tentative de rejoindre la classe:", error);
            toast.error(error.message || "Erreur lors de la tentative de rejoindre la classe");
        }
    };

    return (
        <div>
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Formulaires en attente</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
             <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Rejoindre une classe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Input
                        placeholder="Code de la classe"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                    />
                    <Input
                        placeholder="3 premières lettres de votre nom de famille"
                        value={lastNamePrefix}
                        onChange={(e) => setLastNamePrefix(e.target.value.slice(0, 3))}
                        maxLength={3}
                    />
                    <Button onClick={handleJoinClass}>Rejoindre</Button>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Mes classes</CardTitle>
                </CardHeader>
                <CardContent>
                    {classes.length === 0 ? (
                        <p>Vous n'êtes inscrit à aucune classe pour le moment.</p>
                    ) : (
                        <ul className="list-disc pl-5">
                            {classes.map(cls => (
                                <li key={cls.id}>{cls.name} - {cls.year}</li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentDashboard;