const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs } = require('firebase/firestore');

// Create a new appointment in Firestore
const createAppointment = async (appointmentData) => {
    try {
        const docRef = await addDoc(collection(db, "appointments"), appointmentData);
        return { id: docRef.id, ...appointmentData };
    } catch (error) {
        throw new Error("Error creating appointment: " + error.message);
    }
};

// Get all appointments from Firestore
const getAppointments = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return appointments;
    } catch (error) {
        throw new Error("Error fetching appointments: " + error.message);
    }
};

// Get a single appointment by ID from Firestore
const getAppointmentById = async (appointmentId) => {
    try {
        const appointmentRef = doc(db, "appointments", appointmentId);
        const appointmentDoc = await getDoc(appointmentRef);

        if (!appointmentDoc.exists()) {
            throw new Error("Appointment not found");
        }

        return { id: appointmentDoc.id, ...appointmentDoc.data() };
    } catch (error) {
        throw new Error("Error fetching appointment: " + error.message);
    }
};

// Update appointment data in Firestore
const updateAppointment = async (appointmentId, appointmentData) => {
    try {
        const appointmentRef = doc(db, "appointments", appointmentId);
        await setDoc(appointmentRef, appointmentData, { merge: true });
        return { id: appointmentId, ...appointmentData };
    } catch (error) {
        throw new Error("Error updating appointment: " + error.message);
    }
};

// Delete an appointment from Firestore
const deleteAppointment = async (appointmentId) => {
    try {
        const appointmentRef = doc(db, "appointments", appointmentId);
        await deleteDoc(appointmentRef);
        return { message: "Appointment deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting appointment: " + error.message);
    }
};

module.exports = { createAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment };
