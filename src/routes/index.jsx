import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '@/pages/Register/Register';
import Login from '@/pages/Login/Login';
import Home from '@/pages/Home/Home';
import Categories from '@/pages/Categories/Categories';
import CategoryNotes from '@/pages/CategoryNotes/CategoryNotes';
import Notes from '@/pages/Notes/Notes';
import Note from '../pages/Note/Note';
import CreateNote from '../pages/CreateNote';
import EditNote from '../pages/EditNote';
import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Settings/Settings';
import Layout from '../components/Layout';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    
    <Route path="categories" element={<Categories />} />
    <Route path="notes/categories/:categoryId" element={<CategoryNotes />} />
    <Route path="notes" element={<Notes />} />
    <Route path="notes/:id" element={<Note />} />
    <Route path="notes/edit/:noteId" element={<EditNote />} />
    <Route path="create-note" element={<CreateNote />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />

  </Route>
</Routes>
  );
};

export default AppRoutes;
