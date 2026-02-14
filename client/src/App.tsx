import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './screens/SplashScreen';
import { InterestsScreen } from './screens/InterestsScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MapScreen } from './screens/MapScreen';
import { EventDetailsScreen } from './screens/EventDetailsScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SavedScreen } from './screens/SavedScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminScreen } from './screens/AdminScreen';
import { CreateEventScreen } from './screens/CreateEventScreen';
import { EditEventScreen } from './screens/EditEventScreen';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  // Screens where BottomNav should be visible
  const showNav = ['/home', '/map', '/saved', '/profile'].includes(location.pathname);

  return (
    <>
      {children}
      {showNav && <BottomNav />}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/interests" element={<InterestsScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/event/:id" element={<EventDetailsScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/saved" element={<SavedScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="/admin/create" element={<CreateEventScreen />} />
          <Route path="/admin/edit/:id" element={<EditEventScreen />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}