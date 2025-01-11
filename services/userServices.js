const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs } = require('firebase/firestore');

// Create a new user in Firestore
const createUser = async (userData) => {
    try {
        const docRef = await addDoc(collection(db, "users"), userData);
        return { id: docRef.id, ...userData };
    } catch (error) {
        throw new Error("Error creating user: " + error.message);
    }
};

// Get all users from Firestore
const getUsers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return users;
    } catch (error) {
        throw new Error("Error fetching users: " + error.message);
    }
};

// Get a single user by ID from Firestore
const getUserById = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User not found");
        }

        return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
        throw new Error("Error fetching user: " + error.message);
    }
};

// Update user data in Firestore
const updateUser = async (userId, userData) => {
    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, userData, { merge: true });
        return { id: userId, ...userData };
    } catch (error) {
        throw new Error("Error updating user: " + error.message);
    }
};

// Delete a user from Firestore
const deleteUser = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        await deleteDoc(userRef);
        return { message: "User deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting user: " + error.message);
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
