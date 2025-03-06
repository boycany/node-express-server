import express from "express";
import {
    signin,
    signup,
    updateUserProfile,
    getUsers,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.put("/:id", updateUserProfile);
router.post("/signup", signup);
router.post("/signin", signin);

export default router;
