import express from "express";
import { createInventry, getAllInventory, getOneInventory, updateInventory, deleteInventory, retrieveItems } from "../controllers/inventryController.js";

const router = express.Router();

router.post("/", createInventry);
router.get("/", getAllInventory);
router.get("/:id", getOneInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);
router.post("/:id/retrieve", retrieveItems);

export default router;