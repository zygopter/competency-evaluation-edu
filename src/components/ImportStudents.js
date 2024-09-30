import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useCompetences } from '../contexts/CompetencesContext';
import toast from 'react-hot-toast';

const ImportStudents = ({ classId, onImportComplete }) => {
    const [importText, setImportText] = useState('');
    const { addStudentsToClassById } = useCompetences();

    const handleImport = async () => {
        const lines = importText.split('\n');
        const students = lines.map(line => {
            const [lastName, firstName] = line.split(',').map(s => s.trim());
            return { lastName, firstName };
        }).filter(student => student.lastName && student.firstName);

        if (students.length === 0) {
            toast.error("Aucun élève valide n'a été trouvé dans le texte importé.");
            return;
        }

        try {
            await addStudentsToClassById(classId, students);
            toast.success(`${students.length} élèves ont été importés avec succès.`);
            setImportText('');
            onImportComplete();
        } catch (error) {
            toast.error(`Erreur lors de l'import : ${error.message}`);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Importer des élèves</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-2">
                    Entrez les noms des élèves (un par ligne) au format : Nom, Prénom
                </p>
                <Textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Dupont, Jean&#10;Martin, Marie"
                    rows={10}
                    className="mb-4"
                />
                <Button onClick={handleImport}>Importer les élèves</Button>
            </CardContent>
        </Card>
    );
};

export default ImportStudents;