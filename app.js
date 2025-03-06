import express from "express";
import authRoutes from "./routes/users.route.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", authRoutes);

// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the REST API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
