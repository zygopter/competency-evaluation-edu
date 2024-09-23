import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import StudentDashboard from './StudentDashboard';

const StudentPage = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Page de l'élève</CardTitle>
        </CardHeader>
        <StudentDashboard studentId={user.id} />
      </Card>
    </div>
  );
};

export default StudentPage;