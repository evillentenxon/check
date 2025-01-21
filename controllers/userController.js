const { UserModel } = require("../models/myModel");

// router.get('/users', async (req, res) => {
const usersList = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await UserModel.find(); 

        // Check if there are any users
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }

        // Return the users as response
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error. Could not fetch users.' });
    }
};

const delUser= async (req, res) => {
    const { id } = req.params;

    try {
        // Attempt to find and delete the user by ID
        const user = await UserModel.findByIdAndDelete(id);

        if (!user) {
            // If no user found with the given ID, return a 404 response
            return res.status(404).json({ message: "User not found." });
        }

        // Return success response if user is deleted
        res.status(200).json({ message: "User deleted successfully.", user });
    } catch (error) {
        console.error("Error deleting user:", error);

        // Return a 500 response for any server-side errors
        res.status(500).json({ message: "Internal server error." });
    }
};

const userUpdate= async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    const photo = req.file ? req.file.path : undefined;

    try {
        // Build an update object dynamically
        const updateData = {};
        if (username) updateData.username = username;
        if (password) updateData.password = password;
        if (photo) updateData.photo = photo;

        // Find and update the user
        const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User updated successfully.", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    usersList,
    delUser,
    userUpdate,
}