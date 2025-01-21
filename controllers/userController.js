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

const delUser = async (req, res) => {
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

const userUpdate = async (req, res) => {
    try {
        const { id } = req.params; // Extract user ID from URL
        const { username, password, role } = req.body; // Extract username and password from body
        let updateFields = { username, password, role };

        // Check if a file was uploaded
        if (req.file) {
            updateFields.photo = req.file.path; // Add photo path to updateFields
        }

        // Update user in the database
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            updateFields,
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user', error });
    }
};

module.exports = {
    usersList,
    delUser,
    userUpdate,
}