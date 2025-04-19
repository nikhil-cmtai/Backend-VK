const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs } = require('firebase/firestore');
const { createOrder } = require('../config/cashfree'); // Import Cashfree createOrder function

// Create a new appointment in Firestore with payment integration
const createAppointment = async (appointmentData) => {
    try {
        // Step 1: Create a Cashfree payment order
        const paymentOrder = await createOrder(appointmentData.amount, {
            name: appointmentData.name,
            email: appointmentData.email,
            phone: appointmentData.phone,
        });

        // Step 2: Add payment details to the appointment data
        appointmentData.payment = {
            orderId: paymentOrder.order_id,
            paymentLink: paymentOrder.payment_link,
            status: 'pending',
            amount: appointmentData.amount,
        };

        // Step 3: Save the appointment in Firestore
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
