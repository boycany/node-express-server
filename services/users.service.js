import bcrypt from "bcrypt";
import db from "../config/database.js";
import validateUser from "../utils/validateUser.js";

export function getAllUsers() {
    const stmt = db.prepare("SELECT * FROM users");
    return stmt.all();
}

export function createUser(user) {
    console.log("createUser: ", user);

    try {
        validateUser(user);

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(user.password, saltRounds);

        const stmt = db.prepare(`
            INSERT INTO users (email, password, name)
            VALUES (@email, @password, @name)
        `);

        let result;
        try {
            result = stmt.run({
                email: user.email,
                password: hashedPassword,
                name: user.name,
            });
        } catch (err) {
            // Handle unique constraint violation
            if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
                throw new Error("Email already exists");
            }
            throw err;
        }

        return {
            id: result.lastInsertRowid,
            email: user.email,
            name: user.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

export function findUserByEmail(email) {
    console.log("findUserByEmail: ", email);

    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get(email);
    // console.log("user: ", user);
    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
    };
}

export function findUserById(id) {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    const user = stmt.get(id);

    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
    };
}

export function updateUser(id, userData) {
    try {
        validateUser(userData, true);

        // If password is being updated, hash it
        if (userData.password) {
            const saltRounds = 10;
            userData.password = bcrypt.hashSync(userData.password, saltRounds);
        }

        const stmt = db.prepare(`
            UPDATE users 
            SET email = @email,
                password = @password,
                name = @name,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = @id
        `);

        const result = stmt.run({
            id,
            email: userData.email,
            password: userData.password,
            name: userData.name,
        });

        if (result.changes === 0) return null;

        // Return user without password
        const updatedUser = findUserById(id);
        if (updatedUser) {
            delete updatedUser.password;
        }
        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

export function loginUser(email, password) {
    try {
        // Find user by email
        const user = findUserByEmail(email);
        if (!user) {
            throw new Error("Invalid email or password");
        }

        // Compare password with hash
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid email or password");
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error("Error logging in user:", error);
        return null;
    }
}

export function deleteUser(id) {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
}
