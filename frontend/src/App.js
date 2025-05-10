import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

// 🔐 Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import ConfirmReset from './components/auth/ConfirmReset';

// 👤 User Pages
import Profile from './components/user/Profile';
import ChangePassword from './components/user/ChangePassword';
import Dashboard from './components/user/Dashboard';

// 📚 Book Management
import UploadBook from './components/books/UploadBook';
import EditBook from './components/books/EditBook';
import BookDetail from './components/books/BookDetails';
import TopBooks from './components/books/TopBooks';
import Recommendations from './components/books/Recommendations';
import RecentlyRead from './components/books/RecentlyRead';
import PublicBooks from './components/books/PublicBooks';

// 📖 Library & Reviews
import LibraryPage from './components/library/LibraryPage';
import ReviewPage from './components/reviews/ReviewPage';
import ReaderPage from './components/reader/ReaderPage';

// 📊 Analytics
import Analytics from './components/analytics/Analytics';
import Leaderboard from './components/analytics/Leaderboard';
import PopularBooks from './components/analytics/PopularBooks';

// 🏠 Main Pages
import HomePage from './pages/HomePage';

import AdminDashboard from './components/admin/AdminDashboard';
import BookManagment from './components/admin/BookManagment';
import AdminUploadBook from './components/admin/AdminUploadBook';
import UserManagment from './components/admin/UserManagment';
import AdminProfile from './components/admin/AdminProfile';
import AdminReview from './components/admin/AdminReview';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth pages without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/confirm-reset" element={<ConfirmReset />} />

          {/* Admin panel - standalone */}
          
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<BookManagment />}/>
          <Route path="/admin/upload-books" element={<AdminUploadBook />}/>
          <Route path="/admin/users" element={<UserManagment />}/>
          <Route path="/admin/profile" element={<AdminProfile />}/>
          <Route path="/admin-reviews/:bookId" element={<AdminReview />}/>

          {/* Pages wrapped with navbar/footer */}
          <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/upload" element={<UploadBook />} />
            <Route path="/edit/:bookId" element={<EditBook />} />
            <Route path="/book/:bookId" element={<BookDetail />} />
            <Route path="/top" element={<TopBooks />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/recent" element={<RecentlyRead />} />
            <Route path="/public" element={<PublicBooks />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/reviews/:bookId" element={<ReviewPage />} />
            <Route path="/reader/:bookId" element={<ReaderPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/popular" element={<PopularBooks />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
