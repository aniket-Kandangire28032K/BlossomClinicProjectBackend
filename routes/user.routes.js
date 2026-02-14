import express from "express";
import { createUser, deleteUser, getAllUsers, login,patchUser } from "../controllers/user-controller.js";

const router=express.Router();

router.get('/users',getAllUsers);
router.post('/users',createUser);
router.post('/user',login)
router.delete('/user/:email',deleteUser);
router.patch('/user-update',patchUser);

export default router;