import React, { useState, useEffect } from 'react';
import { useCompetences } from '../contexts/CompetencesContext';
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const StudentDashboard = ({ studentId }) => {
    const [pendingForms, setPendingForms] = useState([]);
    const [studentClasses, setStudentClasses] = useState([]);
    const [classCode, setClassCode] = useState('');
    const [lastNamePrefix, setLastNamePrefix] = useState('');
    const { classes, getStudentPendingForms, searchStudentsInClassByCode, joinClassByCode } = useCompetences();
    const [matchingStudents, setMatchingStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setStudentClasses(classes);
        console.log("Récupération de la liste des classes:", classes);
    }, [classes]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const forms = await getStudentPendingForms(studentId);
                setPendingForms(forms);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
                toast.error("Erreur lors du chargement des données");
            }
        };

        fetchData();
    }, [studentId, getStudentPendingForms]);

    const handleStudentSelect = (studentId) => {
        const student = matchingStudents.find(s => s._id === studentId);
        setSelectedStudentId(student);
    };

    const handleSearch = async () => {
        if (!classCode.trim() || !lastNamePrefix.trim()) {
            toast.error("Veuillez entrer le code de la classe et au moins 3 lettres de votre nom de famille");
            return;
        }
        try {
            const students = await searchStudentsInClassByCode(classCode, lastNamePrefix);
            setMatchingStudents(students);
            if (students.length === 0) {
                toast.error("Aucun élève correspondant trouvé dans cette classe");
            }
        } catch (error) {
            console.error("Erreur lors de la recherche d'élèves:", error);
            toast.error(error.message || "Erreur lors de la recherche d'élèves");
        }
    };

    const handleJoinClass = async () => {
        if (!selectedStudentId) {
            toast.error("Veuillez sélectionner votre nom dans la liste");
            return;
        }
        try {
            const classJoined = await joinClassByCode(classCode, selectedStudentId.firstName, selectedStudentId.lastName);
            setStudentClasses(prevClasses => [...prevClasses, classJoined]);
            setClassCode('');
            setLastNamePrefix('');
            setMatchingStudents([]);
            setSelectedStudentId('');
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
                        placeholder="Au moins 3 lettres de votre nom de famille"
                        value={lastNamePrefix}
                        onChange={(e) => setLastNamePrefix(e.target.value)}
                        minLength={3}
                    />
                    <Button onClick={handleSearch}>Rechercher</Button>

                    {matchingStudents.length > 0 && (
                        <div className="mt-4">
                            <Select onValueChange={handleStudentSelect} value={selectedStudentId?.id || ''}>
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Sélectionnez votre nom" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {matchingStudents.map(student => (
                                        <SelectItem key={student._id} value={student._id} className="cursor-pointer hover:bg-gray-100">
                                            {student.lastName} {student.firstName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedStudentId && (
                                <p className="mt-2">Nom sélectionné : {selectedStudentId.lastName} {selectedStudentId.firstName}</p>
                            )}
                            <Button onClick={handleJoinClass} className="mt-2">Rejoindre la classe</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Mes classes</CardTitle>
                </CardHeader>
                <CardContent>
                    {studentClasses.length === 0 ? (
                        <p>Vous n'êtes inscrit à aucune classe pour le moment.</p>
                    ) : (
                        <ul className="list-disc pl-5">
                            {studentClasses.map(cls => (
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