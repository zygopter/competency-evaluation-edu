import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './components/LoginPage';
import TeacherPage from './components/TeacherPage';
import ClassesTab from './components/ClassesTab';
import ClassDetail from './components/ClassDetail';
import CompetencesTab from './components/CompetencesTab';
import StudentPage from './components/StudentPage';
import TopBar from './components/TopBar';
import FormsTab from './components/FormsTab';
import FormPreview from './components/FormPreview';
import ConfirmationPage from './components/ConfirmationPage';
import { useAuth } from './contexts/AuthContext';
import { AuthConsumer } from './contexts/AuthContext';
import { CompetencesProvider } from './contexts/CompetencesContext';


function App() {
  const { userType, logout } = useAuth();

  const getPageTitle = () => {
    switch(userType) {
      case 'teacher':
        return "Tableau de bord du professeur";
      case 'student':
        return "Page de l'élève";
      default:
        return "Auto-évaluation App";
    }
  };

  return (
    <Router>
      <AuthConsumer>
        {({ userType, logout }) => (
          <div className="App flex flex-col h-screen">
            {userType && (
              <TopBar 
                userType={userType} 
                onLogout={logout} 
                title={userType === 'teacher' ? "Tableau de bord du professeur" : "Page de l'élève"} 
              />
            )}
            <CompetencesProvider>
            <Toaster position="bottom-center" />
            <div className="flex-grow overflow-auto">
              <Routes>
                <Route path="/login" element={userType ? <Navigate to={`/${userType}`} /> : <LoginPage />} />
                <Route path="/teacher" element={<TeacherPage />}>
                  <Route index element={<Navigate to="classes" replace />} />
                  <Route path="classes" element={<ClassesTab />} />
                  <Route path="classes/:classId" element={<ClassDetail />} />
                  <Route path="competences" element={<CompetencesTab />} />
                  <Route path="formulaires" element={<FormsTab />} />
                  <Route path="formulaires/preview/:formId" element={<FormPreview />} />
                </Route>
                <Route 
                  path="/student" 
                  element={userType === 'student' ? <StudentPage /> : <Navigate to="/login" />} 
                />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/" element={<Navigate to={userType ? `/${userType}` : "/login"} />} />
              </Routes>
            </div>
            </CompetencesProvider>
          </div>
        )}
      </AuthConsumer>
    </Router>
  );
}

export default App;