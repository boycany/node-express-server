import {
    User,
    createUser,
    findUserByEmail,
    updateUser,
    loginUser,
    getAllUsers,
} from "../models/user.model.js";

export const getUsers = (req, res) => {
    const users = getAllUsers().map((user) => {
        /** Don't return password */
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };
    });
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
    });
};

export const signup = (req, res) => {
    const { email, password, name } = req.body;

    // Basic validation
    if (
        !email ||
        !password ||
        !name ||
        email.trim() === "" ||
        password.trim() === "" ||
        name.trim() === ""
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid email, password and name",
        });
    }

    // Here you would typically:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Save to database

    try {
        const user = createUser({ email, password, name });
        console.log("user: ", user);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error creating user",
        });
    }

    // For now, just return success
    res.status(201).json({
        success: true,
        message: "User registered successfully",
    });
};

export const signin = (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password || email.trim() === "" || password.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password",
        });
    }
    console.log("email", email);
    console.log("password", password);

    // Here you would typically:
    // 1. Find user by email
    // 2. Compare password
    // 3. Generate JWT token
    const user = loginUser(email, password);
    console.log("user: ", user);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    // For now, just return success
    res.status(200).json({
        success: true,
        message: "User signed in successfully",
    });
};

export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, name } = req.body;

        // Basic validation
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Create update object with only provided fields
        const updateData = {};
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (name) updateData.name = name;

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update",
            });
        }

        const updatedUser = updateUser(id, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating user",
        });
    }
};
