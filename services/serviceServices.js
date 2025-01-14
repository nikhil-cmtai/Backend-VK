const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query, where } = require('firebase/firestore');

// Create a new service in Firestore
const createservice = async (serviceData) => {
    try {
        const docRef = await addDoc(collection(db, "services"), serviceData);
        return { id: docRef.id, ...serviceData };
    } catch (error) {
        throw new Error("Error creating service: " + error.message);
    }
};

// Get all services from Firestore
const getservices = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const services = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return services;
    } catch (error) {
        throw new Error("Error fetching services: " + error.message);
    }
};

// Get active services from Firestore
const getActiveservices = async () => {
    try {
        // Query to filter services where status = "active"
        const activeServicesQuery = query(
            collection(db, "services"),
            where("status", "==", "active")
        );

        // Execute the query
        const querySnapshot = await getDocs(activeServicesQuery);
        const activeServices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return activeServices;
    } catch (error) {
        throw new Error("Error fetching active services: " + error.message);
    }
};

// Get a single service by ID from Firestore
const getserviceById = async (serviceId) => {
    try {
        const serviceRef = doc(db, "services", serviceId);
        const serviceDoc = await getDoc(serviceRef);

        if (!serviceDoc.exists()) {
            throw new Error("Service not found");
        }

        return { id: serviceDoc.id, ...serviceDoc.data() };
    } catch (error) {
        throw new Error("Error fetching service: " + error.message);
    }
};

// Update service data in Firestore
const updateservice = async (serviceId, serviceData) => {
    try {
        const serviceRef = doc(db, "services", serviceId);
        await setDoc(serviceRef, serviceData, { merge: true });
        return { id: serviceId, ...serviceData };
    } catch (error) {
        throw new Error("Error updating service: " + error.message);
    }
};

// Delete a service from Firestore
const deleteservice = async (serviceId) => {
    try {
        const serviceRef = doc(db, "services", serviceId);
        await deleteDoc(serviceRef);
        return { message: "Service deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting service: " + error.message);
    }
};

module.exports = { createservice, getservices, getActiveservices, getserviceById, updateservice, deleteservice };
