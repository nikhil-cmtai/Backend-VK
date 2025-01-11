const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query, orderBy, serverTimestamp } = require('firebase/firestore');

// Create a new blog in Firestore
const createBlog = async (blogData) => {
    try {
        const docRef = await addDoc(collection(db, "blogs"), {
            ...blogData,
            createdAt: serverTimestamp(), // Add createdAt field
        });
        return { id: docRef.id, ...blogData };
    } catch (error) {
        throw new Error("Error creating blog: " + error.message);
    }
};

// Get all blogs from Firestore
const getBlogs = async () => {
    try {
        const blogsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(blogsQuery);
        const blogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return blogs;
    } catch (error) {
        throw new Error("Error fetching blogs: " + error.message);
    }
};

// Get a single blog by ID from Firestore
const getBlogById = async (blogId) => {
    try {
        const blogRef = doc(db, "blogs", blogId);
        const blogDoc = await getDoc(blogRef);

        if (!blogDoc.exists()) {
            throw new Error("Blog not found");
        }

        return { id: blogDoc.id, ...blogDoc.data() };
    } catch (error) {
        throw new Error("Error fetching blog: " + error.message);
    }
};

// Update blog data in Firestore
const updateBlog = async (blogId, blogData) => {
    try {
        const blogRef = doc(db, "blogs", blogId);
        await setDoc(blogRef, blogData, { merge: true });
        return { id: blogId, ...blogData };
    } catch (error) {
        throw new Error("Error updating blog: " + error.message);
    }
};

// Delete a blog from Firestore
const deleteBlog = async (blogId) => {
    try {
        const blogRef = doc(db, "blogs", blogId);
        await deleteDoc(blogRef);
        return { message: "Blog deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting blog: " + error.message);
    }
};

module.exports = { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog };
