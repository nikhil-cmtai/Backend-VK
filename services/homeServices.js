const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs } = require('firebase/firestore');

// Create a new home in Firestore
const createhome = async (homeData) => {
    try {
        const docRef = await addDoc(collection(db, "home"), homeData);
        return { id: docRef.id, ...homeData };
    } catch (error) {
        throw new Error("Error creating home: " + error.message);
    }
};

// Get all homes from Firestore
const gethomes = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "home"));
        const homes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return homes;
    } catch (error) {
        throw new Error("Error fetching homes: " + error.message);
    }
};

// Get a single home by ID from Firestore
const gethomeById = async (homeId) => {
    try {
        const homeRef = doc(db, "home", homeId);
        const homeDoc = await getDoc(homeRef);

        if (!homeDoc.exists()) {
            throw new Error("home not found");
        }

        return { id: homeDoc.id, ...homeDoc.data() };
    } catch (error) {
        throw new Error("Error fetching home: " + error.message);
    }
};

// Update home data in Firestore
const updatehome = async (homeId, homeData) => {
    try {
        const homeRef = doc(db, "home", homeId);
        await setDoc(homeRef, homeData, { merge: true });
        return { id: homeId, ...homeData };
    } catch (error) {
        throw new Error("Error updating home: " + error.message);
    }
};

// Delete a home from Firestore
const deletehome = async (homeId) => {
    try {
        const homeRef = doc(db, "home", homeId);
        await deleteDoc(homeRef);
        return { message: "home deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting home: " + error.message);
    }
};

module.exports = { createhome, gethomes, gethomeById, updatehome, deletehome };
