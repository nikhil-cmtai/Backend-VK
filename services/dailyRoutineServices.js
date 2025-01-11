const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query, where } = require('firebase/firestore');

// Create a new daily routine entry in Firestore
const createDailyRoutine = async (routineData) => {
    try {
        const docRef = await addDoc(collection(db, "dailyRoutine"), routineData);
        return { id: docRef.id, ...routineData };
    } catch (error) {
        throw new Error("Error creating daily routine: " + error.message);
    }
};

// Get all daily routine records from Firestore
const getDailyRoutines = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "dailyRoutine"));
        const routines = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return routines;
    } catch (error) {
        throw new Error("Error fetching daily routines: " + error.message);
    }
};

// Get a daily routine by date from Firestore
const getDailyRoutineByDate = async (date) => {
    try {
        const routineRef = query(
            collection(db, "dailyRoutine"),
            where("date", "==", date)
        );
        const querySnapshot = await getDocs(routineRef);

        if (querySnapshot.empty) {
            throw new Error("Daily routine not found for the specified date");
        }

        const routine = querySnapshot.docs[0].data();
        return { id: querySnapshot.docs[0].id, ...routine };
    } catch (error) {
        throw new Error("Error fetching daily routine: " + error.message);
    }
};

// Update a daily routine in Firestore
const updateDailyRoutine = async (routineId, routineData) => {
    try {
        const routineRef = doc(db, "dailyRoutine", routineId);
        await setDoc(routineRef, routineData, { merge: true });
        return { id: routineId, ...routineData };
    } catch (error) {
        throw new Error("Error updating daily routine: " + error.message);
    }
};

// Delete a daily routine from Firestore
const deleteDailyRoutine = async (routineId) => {
    try {
        const routineRef = doc(db, "dailyRoutine", routineId);
        await deleteDoc(routineRef);
        return { message: "Daily routine deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting daily routine: " + error.message);
    }
};

module.exports = {
    createDailyRoutine,
    getDailyRoutines,
    getDailyRoutineByDate,
    updateDailyRoutine,
    deleteDailyRoutine
};
