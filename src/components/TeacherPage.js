import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle } from 'lucide-react';
import CompetencesTab from './CompetencesTab';
import ClassesTab from './ClassesTab';

const TeacherPage = () => {
    const location = useLocation();
    const { user } = useAuth();

    const getCurrentTab = () => {
        if (location.pathname.includes('classes')) return 'classes';
        if (location.pathname.includes('competences')) return 'competences';
        if (location.pathname.includes('formulaires')) return 'formulaires';
        return '';
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center space-x-4">
                    <UserCircle size={48} />
                    <div>
                        <CardTitle className="text-2xl">Bienvenue, {user.name}</CardTitle>
                        <p className="text-blue-100">Espace Professeur</p>
                    </div>
                </CardHeader>
            </Card>
            <h1 className="text-2xl font-bold mb-4">Tableau de bord du professeur</h1>
            <Tabs value={location.pathname.includes('classes') ? 'classes' : 'competences'}>
                <TabsList>
                    <TabsTrigger value="classes" asChild>
                        <NavLink to="/teacher/classes">Classes</NavLink>
                    </TabsTrigger>
                    <TabsTrigger value="competences" asChild>
                        <NavLink to="/teacher/competences">Compétences</NavLink>
                    </TabsTrigger>
                    <TabsTrigger value="formulaires" asChild>
                        <NavLink to="/teacher/formulaires">Formulaires</NavLink>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="mt-4">
                <Outlet />
            </div>
        </div>
    );
};

export default TeacherPage;