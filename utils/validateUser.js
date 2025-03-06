import db from "../config/database.js";

function validateUser(user, isUpdate = false) {
    // For updates, only validate fields that are being updated
    if (isUpdate) {
        if (user.email && !user.email.trim()) {
            throw new Error("Email cannot be empty");
        }
        if (user.password && !user.password.trim()) {
            throw new Error("Password cannot be empty");
        }
        if (user.name && !user.name.trim()) {
            throw new Error("Name cannot be empty");
        }
    } else {
        // For new users, all fields are required
        if (
            !user.email?.trim() ||
            !user.password?.trim() ||
            !user.name?.trim()
        ) {
            throw new Error(
                "Email, password and name are required and cannot be empty"
            );
        }
    }

    // Validate email format if email is provided
    if (user.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            throw new Error("Please provide a valid email address");
        }
    }
    console.log("isUpdate", isUpdate);
    console.log("user", user);

    // Check if email already exists (only for new users or when email is being updated)
    if (!isUpdate && user.email) {
        const existingUser = db
            .prepare("SELECT email FROM users WHERE email = ?")
            .get(user.email);
        if (existingUser) {
            throw new Error("Email address is already registered");
        }
    }

    // Validate password requirements if password is provided
    if (user.password) {
        if (user.password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }
        if (!/(?=.*[a-z])/.test(user.password)) {
            throw new Error(
                "Password must contain at least one lowercase letter"
            );
        }
        if (!/(?=.*[A-Z])/.test(user.password)) {
            throw new Error(
                "Password must contain at least one uppercase letter"
            );
        }
        if (!/(?=.*\d)/.test(user.password)) {
            throw new Error("Password must contain at least one number");
        }
    }
}

export default validateUser;
