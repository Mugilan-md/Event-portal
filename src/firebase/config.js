import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword as fbSignIn, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged,
  createUserWithEmailAndPassword as fbCreateUser
} from "firebase/auth";
import { 
  getFirestore, 
  collection as fbCollection, 
  doc as fbDoc, 
  getDocs as fbGetDocs, 
  getDoc as fbGetDoc, 
  addDoc as fbAddDoc, 
  setDoc as fbSetDoc, 
  updateDoc as fbUpdateDoc, 
  deleteDoc as fbDeleteDoc,
  query as fbQuery,
  where as fbWhere,
  orderBy as fbOrderBy
} from "firebase/firestore";

// PASTE YOUR FIREBASE CONFIGURATION HERE
// Replace placeholders with your actual credentials to connect to live Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyC7JeePmRbrXuHvsGFAEEMI_ykawtqBhsY",
  authDomain: "event-portal-3afc1.firebaseapp.com",
  projectId: "event-portal-3afc1",
  storageBucket: "event-portal-3afc1.firebasestorage.app",
  messagingSenderId: "766961504428",
  appId: "1:766961504428:web:7fa65f7b8bc91d49368f09",
  measurementId: "G-ZYPZCFJQ7Z"
};

// Check if using placeholder configurations
const isPlaceholder = 
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey.includes("YOUR_FIREBASE_API_KEY") || 
  firebaseConfig.apiKey.includes("PLACEHOLDER");

let app, auth, db;
let isMockMode = false;

if (isPlaceholder) {
  console.warn("Event Registration Portal: Firebase API Key is not set or is a placeholder. Activating Mock/Demo mode (data will persist in localStorage).");
  isMockMode = true;
} else {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed, falling back to mock mode:", error);
    isMockMode = true;
  }
}

// ----------------------------------------------------
// LOCAL STORAGE MOCK SYSTEM FOR AUTH & FIRESTORE
// ----------------------------------------------------

const getLocalStorageItem = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Seed mock data if empty
if (isMockMode) {
  if (!localStorage.getItem("erp_events")) {
    setLocalStorageItem("erp_events", [
      {
        id: "mock-ev-1",
        title: "CyberPulse Hackathon 2026",
        description: "A 36-hour elite coding challenge designed to push the boundaries of Web3, AI agents, and decentralized applications. Participate in teams to solve real-world problems and win grand prizes.",
        rules: "1. Teams of 2 to 4 members are allowed.\n2. Development must start from scratch.\n3. Plagiarism leads to immediate disqualification.\n4. Decisions of the jury are final.",
        prizes: "🥇 First Prize: $5,000 + Dev Grants\n🥈 Second Prize: $2,500\n🥉 Third Prize: $1,000",
        teamSize: 4,
        posterUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        venue: "Tech Auditorium Hall A",
        date: "2026-07-15",
        time: "09:00 AM",
        registrationFee: 250,
        lastRegistrationDate: "2026-07-10",
        coordinators: [
          { name: "Alex Mercer", phone: "+1 (555) 019-2834" },
          { name: "Sarah Chen", phone: "+1 (555) 019-5821" }
        ],
        category: "Hackathon",
        status: "open",
        seatsAvailable: 45,
        totalSeats: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: "mock-ev-2",
        title: "Quantum Symposium 2.0",
        description: "A premier research symposium gathering top scientists, developers, and industry practitioners to showcase novel concepts, papers, and hardware designs in quantum computing.",
        rules: "1. Abstract submission required in advance.\n2. Standard presentation duration is 15 mins.\n3. Q&A session follows every presentation.",
        prizes: "🏆 Best Paper Award: $1,500 + Certificate",
        teamSize: 2,
        posterUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
        venue: "Science Block Block B",
        date: "2026-08-20",
        time: "10:30 AM",
        registrationFee: 100,
        lastRegistrationDate: "2026-08-15",
        coordinators: [
          { name: "Dr. Robert Vance", phone: "+1 (555) 021-9988" }
        ],
        category: "Symposium",
        status: "open",
        seatsAvailable: 120,
        totalSeats: 150,
        createdAt: new Date().toISOString()
      },
      {
        id: "mock-ev-3",
        title: "A.I. Agents Workshop",
        description: "Hands-on technical workshop focused on building autonomous LLM agents using modern frameworks. Create your own agent workflow and deploy it in production during the session.",
        rules: "1. Bring your own laptop.\n2. Basic knowledge of JavaScript or Python is recommended.",
        prizes: "🏅 Certificate of Excellence & API Credits",
        teamSize: 1,
        posterUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        venue: "Virtual Event (Zoom Link Provided)",
        date: "2026-06-25",
        time: "02:00 PM",
        registrationFee: 0,
        lastRegistrationDate: "2026-06-23",
        coordinators: [
          { name: "Elena Rostova", phone: "+1 (555) 012-3498" }
        ],
        category: "Workshop",
        status: "open",
        seatsAvailable: 0, // closed/sold out representation
        totalSeats: 200,
        createdAt: new Date().toISOString()
      }
    ]);
  }
  
  if (!localStorage.getItem("erp_admins")) {
    setLocalStorageItem("erp_admins", []);
  }

  if (!localStorage.getItem("erp_registrations")) {
    setLocalStorageItem("erp_registrations", []);
  } else {
    // Programmatically purge the Devon Lane seed registration if present
    const existingRegs = getLocalStorageItem("erp_registrations", []);
    if (existingRegs.some(r => r.email === "devon@apex.edu")) {
      setLocalStorageItem("erp_registrations", existingRegs.filter(r => r.email !== "devon@apex.edu"));
    }
  }

  if (!localStorage.getItem("erp_queries")) {
    setLocalStorageItem("erp_queries", []);
  }
}

// Simulated Auth Class
class MockAuth {
  constructor() {
    this.currentUser = getLocalStorageItem("erp_current_user", null);
    this.listeners = [];
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    // Execute immediately with current state
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async signInWithEmailAndPassword(email, password) {
    const admins = getLocalStorageItem("erp_admins", []);
    const admin = admins.find(a => a.email === email && a.password === password);
    
    // Support default demo and typed admin credentials seamlessly in mock mode
    if (!admin) {
      if ((email === "admin@portal.com" && password === "admin123") ||
          (email === "superior@portal.com" && password === "adminpassword123") ||
          admins.length === 0) {
        const defaultAdmin = { email, password, uid: "mock-admin-" + Date.now(), role: "admin" };
        admins.push(defaultAdmin);
        setLocalStorageItem("erp_admins", admins);
        
        this.currentUser = { uid: defaultAdmin.uid, email };
        setLocalStorageItem("erp_current_user", this.currentUser);
        this.listeners.forEach(l => l(this.currentUser));
        return { user: this.currentUser };
      }
    }

    if (admin) {
      this.currentUser = { uid: admin.uid || "mock-admin-uid", email: admin.email };
      setLocalStorageItem("erp_current_user", this.currentUser);
      this.listeners.forEach(l => l(this.currentUser));
      return { user: this.currentUser };
    } else {
      // Auto-register typed credentials if no admins or for fallback ease
      const newAdmin = { email, password, uid: "mock-admin-" + Date.now(), role: "admin" };
      admins.push(newAdmin);
      setLocalStorageItem("erp_admins", admins);
      this.currentUser = { uid: newAdmin.uid, email: newAdmin.email };
      setLocalStorageItem("erp_current_user", this.currentUser);
      this.listeners.forEach(l => l(this.currentUser));
      return { user: this.currentUser };
    }
  }

  async createUserWithEmailAndPassword(email, password) {
    const admins = getLocalStorageItem("erp_admins", []);
    if (admins.find(a => a.email === email)) {
      throw new Error("Admin email already exists.");
    }
    const newAdmin = { email, password, uid: "mock-" + Math.random().toString(36).substr(2, 9), role: "admin" };
    admins.push(newAdmin);
    setLocalStorageItem("erp_admins", admins);
    
    this.currentUser = { uid: newAdmin.uid, email: newAdmin.email };
    setLocalStorageItem("erp_current_user", this.currentUser);
    this.listeners.forEach(l => l(this.currentUser));
    return { user: this.currentUser };
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem("erp_current_user");
    this.listeners.forEach(l => l(null));
  }
}

const mockAuthInstance = new MockAuth();

// Simulated Firestore Mock Helpers
const mockFirestore = {
  // Add Event
  addEvent: async (data) => {
    const events = getLocalStorageItem("erp_events", []);
    const newId = "ev-" + Math.random().toString(36).substr(2, 9);
    const newEvent = { ...data, id: newId, createdAt: new Date().toISOString() };
    events.push(newEvent);
    setLocalStorageItem("erp_events", events);
    return { id: newId };
  },
  
  // Set Event (or Edit)
  updateEvent: async (id, data) => {
    const events = getLocalStorageItem("erp_events", []);
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) throw new Error("Event not found");
    events[idx] = { ...events[idx], ...data };
    setLocalStorageItem("erp_events", events);
  },

  deleteEvent: async (id) => {
    const events = getLocalStorageItem("erp_events", []);
    const filtered = events.filter(e => e.id !== id);
    setLocalStorageItem("erp_events", filtered);
  },

  getEvents: async () => {
    return getLocalStorageItem("erp_events", []);
  },

  getEvent: async (id) => {
    const events = getLocalStorageItem("erp_events", []);
    return events.find(e => e.id === id) || null;
  },

  // Add Registration
  addRegistration: async (data) => {
    const registrations = getLocalStorageItem("erp_registrations", []);
    const newId = "reg-" + Math.random().toString(36).substr(2, 9);
    const newReg = { ...data, id: newId, timestamp: new Date().toISOString() };
    registrations.push(newReg);
    setLocalStorageItem("erp_registrations", registrations);
    
    // Subtract seats if available
    const events = getLocalStorageItem("erp_events", []);
    const evIdx = events.findIndex(e => e.id === data.eventId);
    if (evIdx !== -1 && events[evIdx].seatsAvailable > 0) {
      events[evIdx].seatsAvailable = Math.max(0, events[evIdx].seatsAvailable - 1);
      setLocalStorageItem("erp_events", events);
    }

    // Add unique participant
    const participants = getLocalStorageItem("erp_participants", []);
    const pIdx = participants.findIndex(p => p.email === data.email);
    const regSummary = { eventId: data.eventId, registrationId: data.registrationId };
    
    if (pIdx !== -1) {
      participants[pIdx].registeredEvents = [...(participants[pIdx].registeredEvents || []), regSummary];
      participants[pIdx].updatedAt = new Date().toISOString();
    } else {
      participants.push({
        email: data.email,
        name: data.name,
        college: data.collegeName,
        phone: data.phone,
        registeredEvents: [regSummary],
        updatedAt: new Date().toISOString()
      });
    }
    setLocalStorageItem("erp_participants", participants);

    return { id: newId };
  },

  getRegistrations: async () => {
    return getLocalStorageItem("erp_registrations", []);
  },

  getAdminsCount: async () => {
    const admins = getLocalStorageItem("erp_admins", []);
    return admins.length;
  },

  deleteRegistration: async (id) => {
    const registrations = getLocalStorageItem("erp_registrations", []);
    const regToDelete = registrations.find(r => r.id === id || r.registrationId === id);
    if (!regToDelete) return;
    
    // Remove registration
    const filteredRegs = registrations.filter(r => r.id !== id && r.registrationId !== id);
    setLocalStorageItem("erp_registrations", filteredRegs);
    
    // Add seats back to the event
    const events = getLocalStorageItem("erp_events", []);
    const evIdx = events.findIndex(e => e.id === regToDelete.eventId);
    if (evIdx !== -1) {
      events[evIdx].seatsAvailable = Math.min(events[evIdx].totalSeats, (events[evIdx].seatsAvailable || 0) + 1);
      setLocalStorageItem("erp_events", events);
    }
    
    // Remove from participant's registered events
    const participants = getLocalStorageItem("erp_participants", []);
    const pIdx = participants.findIndex(p => p.email === regToDelete.email);
    if (pIdx !== -1) {
      const registered = participants[pIdx].registeredEvents || [];
      const updatedRegs = registered.filter(r => r.registrationId !== regToDelete.registrationId);
      if (updatedRegs.length === 0) {
        const filteredParts = participants.filter(p => p.email !== regToDelete.email);
        setLocalStorageItem("erp_participants", filteredParts);
      } else {
        participants[pIdx].registeredEvents = updatedRegs;
        participants[pIdx].updatedAt = new Date().toISOString();
        setLocalStorageItem("erp_participants", participants);
      }
    }
  },

  updateRegistration: async (id, data) => {
    const registrations = getLocalStorageItem("erp_registrations", []);
    const idx = registrations.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Registration not found");
    registrations[idx] = { ...registrations[idx], ...data };
    setLocalStorageItem("erp_registrations", registrations);
  },

  addQuery: async (data) => {
    const queries = getLocalStorageItem("erp_queries", []);
    const newId = "q-" + Math.random().toString(36).substr(2, 9);
    const newQuery = { ...data, id: newId, timestamp: new Date().toISOString() };
    queries.push(newQuery);
    setLocalStorageItem("erp_queries", queries);
    return { id: newId };
  },

  getQueries: async () => {
    return getLocalStorageItem("erp_queries", []);
  },

  deleteQuery: async (id) => {
    const queries = getLocalStorageItem("erp_queries", []);
    const filtered = queries.filter(q => q.id !== id);
    setLocalStorageItem("erp_queries", filtered);
  },

  updateQuery: async (id, data) => {
    const queries = getLocalStorageItem("erp_queries", []);
    const idx = queries.findIndex(q => q.id === id);
    if (idx !== -1) {
      queries[idx] = { ...queries[idx], ...data };
      setLocalStorageItem("erp_queries", queries);
    }
  }
};

// ----------------------------------------------------
// EXPORTING LIVE OR MOCK METHODS
// ----------------------------------------------------

export { isMockMode };

export const signInWithEmailAndPassword = async (email, password) => {
  if (isMockMode) {
    return mockAuthInstance.signInWithEmailAndPassword(email, password);
  }
  try {
    return await fbSignIn(auth, email, password);
  } catch (err) {
    // If user does not exist in Firebase auth yet, auto-provision admin account seamlessly
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/invalid-email") {
      try {
        const creds = await fbCreateUser(auth, email, password);
        await registerFirstAdmin(email, creds.user.uid);
        return creds;
      } catch (createErr) {
        throw err;
      }
    }
    throw err;
  }
};

export const createUserWithEmailAndPassword = async (email, password) => {
  if (isMockMode) {
    return mockAuthInstance.createUserWithEmailAndPassword(email, password);
  }
  return fbCreateUser(auth, email, password);
};

export const signOut = async () => {
  if (isMockMode) {
    return mockAuthInstance.signOut();
  }
  return fbSignOut(auth);
};

export const onAuthStateChanged = (callback) => {
  if (isMockMode) {
    return mockAuthInstance.onAuthStateChanged(callback);
  }
  return fbOnAuthStateChanged(auth, callback);
};

// FIRESTORE PUBLIC & ADMIN FUNCTIONS

export const getEventsList = async () => {
  if (isMockMode) {
    return mockFirestore.getEvents();
  }
  try {
    const q = fbQuery(fbCollection(db, "events"), fbOrderBy("createdAt", "desc"));
    const snap = await fbGetDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Firestore getEventsList error, using mock:", err);
    return mockFirestore.getEvents();
  }
};

export const getEventById = async (id) => {
  if (isMockMode) {
    return mockFirestore.getEvent(id);
  }
  try {
    const docRef = fbDoc(db, "events", id);
    const snap = await fbGetDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.error("Firestore getEventById error, using mock:", err);
    return mockFirestore.getEvent(id);
  }
};

export const createEvent = async (data) => {
  if (isMockMode) {
    return mockFirestore.addEvent(data);
  }
  const docRef = await fbAddDoc(fbCollection(db, "events"), {
    ...data,
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id };
};

export const updateEventData = async (id, data) => {
  if (isMockMode) {
    return mockFirestore.updateEvent(id, data);
  }
  const docRef = fbDoc(db, "events", id);
  await fbUpdateDoc(docRef, data);
};

export const deleteEventData = async (id) => {
  if (isMockMode) {
    return mockFirestore.deleteEvent(id);
  }
  const docRef = fbDoc(db, "events", id);
  await fbDeleteDoc(docRef);
};

export const registerParticipant = async (data) => {
  if (isMockMode) {
    return mockFirestore.addRegistration(data);
  }
  
  // Real Firestore Transaction or batch to add registration, subtract seat, and update unique participant
  const regRef = await fbAddDoc(fbCollection(db, "registrations"), {
    ...data,
    timestamp: new Date().toISOString()
  });

  // Try updating seats in events collection (doc)
  try {
    const eventRef = fbDoc(db, "events", data.eventId);
    const eventSnap = await fbGetDoc(eventRef);
    if (eventSnap.exists()) {
      const seats = eventSnap.data().seatsAvailable || 0;
      if (seats > 0) {
        await fbUpdateDoc(eventRef, { seatsAvailable: seats - 1 });
      }
    }
  } catch (e) {
    console.error("Failed to update seat count:", e);
  }

  // Try adding/updating participant doc
  try {
    const partRef = fbDoc(db, "participants", data.email);
    const partSnap = await fbGetDoc(partRef);
    const regSummary = { eventId: data.eventId, registrationId: data.registrationId };
    
    if (partSnap.exists()) {
      const registered = partSnap.data().registeredEvents || [];
      await fbSetDoc(partRef, {
        ...partSnap.data(),
        registeredEvents: [...registered, regSummary],
        updatedAt: new Date().toISOString()
      });
    } else {
      await fbSetDoc(partRef, {
        email: data.email,
        name: data.name,
        college: data.collegeName,
        phone: data.phone,
        registeredEvents: [regSummary],
        updatedAt: new Date().toISOString()
      });
    }
  } catch (e) {
    console.error("Failed to write to participants database:", e);
  }

  return { id: regRef.id };
};

export const getRegistrationsList = async () => {
  if (isMockMode) {
    return mockFirestore.getRegistrations();
  }
  try {
    const snap = await fbGetDocs(fbCollection(db, "registrations"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Firestore getRegistrations error, using mock:", err);
    return mockFirestore.getRegistrations();
  }
};

export const checkAdminExists = async () => {
  if (isMockMode) {
    const count = await mockFirestore.getAdminsCount();
    return count > 0;
  }
  try {
    const snap = await fbGetDocs(fbCollection(db, "admins"));
    return !snap.empty;
  } catch (err) {
    console.error("Firestore checkAdminExists error, returning true to avoid logic breaks:", err);
    return true;
  }
};

export const registerFirstAdmin = async (email, uid) => {
  if (isMockMode) {
    // Already handles via auth simulation (writes password too)
    return;
  }
  // Register in admins collection
  const adminRef = fbDoc(db, "admins", uid);
  await fbSetDoc(adminRef, {
    email,
    role: "admin",
    createdAt: new Date().toISOString()
  });
};

export const deleteRegistration = async (id, eventId, email, registrationId) => {
  if (isMockMode) {
    return mockFirestore.deleteRegistration(id);
  }
  
  // 1. Delete registration document
  const regRef = fbDoc(db, "registrations", id);
  await fbDeleteDoc(regRef);

  // 2. Increment seatsAvailable in events
  try {
    const eventRef = fbDoc(db, "events", eventId);
    const eventSnap = await fbGetDoc(eventRef);
    if (eventSnap.exists()) {
      const currentSeats = eventSnap.data().seatsAvailable || 0;
      const totalSeats = eventSnap.data().totalSeats || 100;
      await fbUpdateDoc(eventRef, { seatsAvailable: Math.min(totalSeats, currentSeats + 1) });
    }
  } catch (e) {
    console.error("Failed to restore seat count:", e);
  }

  // 3. Remove registration from participant profile
  try {
    const partRef = fbDoc(db, "participants", email);
    const partSnap = await fbGetDoc(partRef);
    if (partSnap.exists()) {
      const registered = partSnap.data().registeredEvents || [];
      const updatedRegs = registered.filter(r => r.registrationId !== registrationId);
      if (updatedRegs.length === 0) {
        await fbDeleteDoc(partRef);
      } else {
        await fbUpdateDoc(partRef, {
          registeredEvents: updatedRegs,
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (e) {
    console.error("Failed to update participant profile:", e);
  }
};

export const updateRegistrationData = async (id, data) => {
  if (isMockMode) {
    return mockFirestore.updateRegistration(id, data);
  }
  const docRef = fbDoc(db, "registrations", id);
  await fbUpdateDoc(docRef, data);
};

// Contact Form Queries Support
export const addContactQuery = async (data) => {
  if (isMockMode) {
    return mockFirestore.addQuery(data);
  }
  const docRef = await fbAddDoc(fbCollection(db, "queries"), {
    ...data,
    timestamp: new Date().toISOString()
  });
  return { id: docRef.id };
};

export const getContactQueries = async () => {
  if (isMockMode) {
    return mockFirestore.getQueries();
  }
  try {
    const snap = await fbGetDocs(fbCollection(db, "queries"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (err) {
    console.error("Firestore getContactQueries error, using mock:", err);
    return mockFirestore.getQueries();
  }
};

export const deleteContactQuery = async (id) => {
  if (isMockMode) {
    return mockFirestore.deleteQuery(id);
  }
  const docRef = fbDoc(db, "queries", id);
  await fbDeleteDoc(docRef);
};

export const updateContactQuery = async (id, data) => {
  if (isMockMode) {
    return mockFirestore.updateQuery(id, data);
  }
  const docRef = fbDoc(db, "queries", id);
  await fbUpdateDoc(docRef, data);
};

export const getRegistrationByRegistrationId = async (registrationId) => {
  if (isMockMode) {
    const registrations = getLocalStorageItem("erp_registrations", []);
    return registrations.find(r => r.registrationId === registrationId) || null;
  }
  try {
    const q = fbQuery(fbCollection(db, "registrations"), fbWhere("registrationId", "==", registrationId));
    const snap = await fbGetDocs(q);
    if (!snap.empty) {
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (err) {
    console.error("Firestore getRegistrationByRegistrationId error:", err);
    const registrations = getLocalStorageItem("erp_registrations", []);
    return registrations.find(r => r.registrationId === registrationId) || null;
  }
};
