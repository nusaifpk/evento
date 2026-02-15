import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { FloatingPlusButton } from './components/FloatingPlusButton';
import { AdminLayout } from './components/AdminLayout';
import { SplashScreen } from './screens/SplashScreen';
import { InterestsScreen } from './screens/InterestsScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MapScreen } from './screens/MapScreen';
import { EventDetailsScreen } from './screens/EventDetailsScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SavedScreen } from './screens/SavedScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SubmitEventScreen } from './screens/SubmitEventScreen';
import { CreateEventScreen } from './screens/CreateEventScreen';
import { EditEventScreen } from './screens/EditEventScreen';
import { Dashboard } from './screens/admin/Dashboard';
import { PendingEvents } from './screens/admin/PendingEvents';
import { ApprovedEvents } from './screens/admin/ApprovedEvents';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  // Screens where BottomNav should be visible
  const showNav = ['/home', '/map', '/saved', '/profile'].includes(location.pathname);

  return (
    <>
      {children}
      {showNav && <BottomNav />}
      <FloatingPlusButton />
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
          <Route path="/submit-event" element={<SubmitEventScreen />} />
          
          {/* Admin Routes with Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="events" element={<ApprovedEvents />} />
            <Route path="pending" element={<PendingEvents />} />
            <Route path="create" element={<CreateEventScreen />} />
            <Route path="edit/:id" element={<EditEventScreen />} />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}