import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle } from 'lucide-react';
import StudentDashboard from './StudentDashboard';

const StudentPage = () => {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center space-x-4">
          <UserCircle size={48} />
          <div>
            <CardTitle className="text-2xl">Bienvenue, {user.name}</CardTitle>
            <p className="text-blue-100">Espace Élève</p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">Tableau de bord</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentDashboard studentId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPage;