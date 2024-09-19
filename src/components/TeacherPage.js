import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import CompetencesTab from './CompetencesTab';
import ClassesTab from './ClassesTab';

const TeacherPage = () => {
    const [activeTab, setActiveTab] = useState("competences");
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tableau de bord du professeur</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="competences">Compétences</TabsTrigger>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                </TabsList>
                <TabsContent value="competences">
                    <CompetencesTab />
                </TabsContent>
                <TabsContent value="classes">
                    <ClassesTab />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TeacherPage;