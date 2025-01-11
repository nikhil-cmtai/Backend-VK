const { db } = require('../config/firebase'); // Ensure you import firebase config first
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query, where } = require('firebase/firestore');

// Create a new purohit in Firestore
const createPurohit = async (purohitData) => {
  try {
    // Save Purohit data to Firestore
    const docRef = await addDoc(collection(db, "purohits"), purohitData);
    return { id: docRef.id, ...purohitData };
  } catch (error) {
    throw new Error("Error creating purohit: " + error.message);
  }
};

// Fetch Purohits with status = "active"
const fetchActivePurohits = async () => {
  try {
    // Reference to the 'purohits' collection
    const purohitsRef = collection(db, "purohits");

    // Create a query to filter by status = "active"
    const activePurohitsQuery = query(purohitsRef, where("status", "==", "active"));

    // Execute the query
    const querySnapshot = await getDocs(activePurohitsQuery);

    // Map the results into an array of purohits
    const activePurohits = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return activePurohits;
  } catch (error) {
    throw new Error("Error fetching active purohits: " + error.message);
  }
};

// Get all purohits from Firestore
const getPurohits = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "purohits"));
    const purohits = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return purohits;
  } catch (error) {
    throw new Error("Error fetching purohits: " + error.message);
  }
};

// Get a single purohit by ID from Firestore
const getPurohitById = async (purohitId) => {
  try {
    const purohitRef = doc(db, "purohits", purohitId);
    const purohitDoc = await getDoc(purohitRef);

    if (!purohitDoc.exists()) {
      throw new Error("Purohit not found");
    }

    return { id: purohitDoc.id, ...purohitDoc.data() };
  } catch (error) {
    throw new Error("Error fetching purohit: " + error.message);
  }
};

// Update purohit data in Firestore
const updatePurohit = async (purohitId, purohitData) => {
  try {
    const purohitRef = doc(db, "purohits", purohitId);
    await setDoc(purohitRef, purohitData, { merge: true });
    return { id: purohitId, ...purohitData };
  } catch (error) {
    throw new Error("Error updating purohit: " + error.message);
  }
};

// Delete a purohit from Firestore
const deletePurohit = async (purohitId) => {
  try {
    const purohitRef = doc(db, "purohits", purohitId);
    await deleteDoc(purohitRef);
    return { message: "Purohit deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting purohit: " + error.message);
  }
};

module.exports = { createPurohit, getPurohits, getPurohitById, updatePurohit, deletePurohit, fetchActivePurohits };
