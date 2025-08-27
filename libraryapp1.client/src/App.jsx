import './App.css';
import Login from './pages/Login';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LanguageForm from './pages/admin/LanguageForm';
import CategoryForm from './pages/admin/CategoryForm';
import BookForm from './pages/admin/BookForm';
import AuthorForm from './pages/admin/AuthorForm';
import UserForm from './pages/admin/UserForm';
import IssueManagement from './pages/admin/IssueManagement';
import AdminLayout from './Layout/AdminLayout';
import Home from './pages/user/Home';
import ReturnPage from './pages/admin/ReturnPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                
                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                             <BookForm />
                        </ProtectedRoute>
                    } />
                    <Route path="add-language" element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <LanguageForm />
                        </ProtectedRoute>
                    } />
                    <Route path="add-category" element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <CategoryForm />
                        </ProtectedRoute>
                    } />
                    <Route path="add-book" element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <BookForm />
                        </ProtectedRoute>
                    } />
                    <Route path="add-author" element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <AuthorForm />
                        </ProtectedRoute>
                    } />
                    <Route path="add-user" element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <UserForm />
                        </ProtectedRoute>
                    } />
                    <Route path="manage-issue" element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <IssueManagement />
                        </ProtectedRoute>
                    } />
                    <Route path="manage-return" element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <ReturnPage />
                        </ProtectedRoute>
                    } />
                </Route>

                {/* User Routes */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute allowedRoles={['user']}>
                           <Home />
                        </ProtectedRoute>
                    }
                >
                    <Route path="home" element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <Home />
                        </ProtectedRoute>
                    } />
                </Route>

                {/* Catch-all redirect to login */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
