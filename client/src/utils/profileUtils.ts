import { getUserId } from './userManager';

// Generate anonymous profile data
export const generateAnonymousProfile = () => {
  const userId = getUserId();
  const userNumber = userId.split('_')[1]?.substring(0, 8) || '00000000';
  const anonymousNumber = `#${userNumber.toUpperCase()}`;
  
  return {
    name: 'Anonymous',
    number: anonymousNumber,
    bio: 'Event explorer 🎉 | Vibe curator 🌟',
    profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
  };
};

// Local storage keys for user events
const SAVED_EVENTS_KEY = 'evento_saved_events';
const USER_EVENTS_KEY = 'evento_user_events';
const PAST_EVENTS_KEY = 'evento_past_events';

// Save event to saved events
export const saveEvent = (eventId: string) => {
  const savedEvents = getSavedEvents();
  if (!savedEvents.includes(eventId)) {
    savedEvents.push(eventId);
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEvents));
  }
};

// Remove event from saved events
export const unsaveEvent = (eventId: string) => {
  const savedEvents = getSavedEvents();
  const filtered = savedEvents.filter(id => id !== eventId);
  localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(filtered));
};

// Get saved events
export const getSavedEvents = (): string[] => {
  const saved = localStorage.getItem(SAVED_EVENTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

// Add event created by user
export const addUserEvent = (eventId: string) => {
  const userEvents = getUserEvents();
  if (!userEvents.includes(eventId)) {
    userEvents.push(eventId);
    localStorage.setItem(USER_EVENTS_KEY, JSON.stringify(userEvents));
  }
};

// Get events created by user
export const getUserEvents = (): string[] => {
  const events = localStorage.getItem(USER_EVENTS_KEY);
  return events ? JSON.parse(events) : [];
};

// Add past event
export const addPastEvent = (eventId: string) => {
  const pastEvents = getPastEvents();
  if (!pastEvents.includes(eventId)) {
    pastEvents.push(eventId);
    localStorage.setItem(PAST_EVENTS_KEY, JSON.stringify(pastEvents));
  }
};

// Get past events
export const getPastEvents = (): string[] => {
  const events = localStorage.getItem(PAST_EVENTS_KEY);
  return events ? JSON.parse(events) : [];
};

// Get user stats
export const getUserStats = () => {
  return {
    eventsCount: getUserEvents().length,
    followersCount: 0, // Anonymous users have 0 followers
    followingCount: 0, // Anonymous users follow 0 people
    savedEventsCount: getSavedEvents().length,
    pastEventsCount: getPastEvents().length,
  };
};
