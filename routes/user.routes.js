import express from "express";
import { createUser, deleteUser, getAllUsers, login } from "../controllers/user-controller.js";

const router=express.Router();

router.get('/users',getAllUsers);
router.post('/users',createUser);
router.post('/user',login)
router.delete('/user/:email',deleteUser);

export default router;