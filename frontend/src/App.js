import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

// 🔐 Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

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
import ResetPassword from './components/auth/ResetPassword'; // adjust path if needed

import ConfirmReset from './components/auth/ConfirmReset';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth pages without Navbar/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Layout-wrapped routes */}
          <Route element={<MainLayout />}>
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
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/confirm-reset" element={<ConfirmReset />} />


          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
