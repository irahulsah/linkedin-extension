const { Router } = require("express");

const { mondayTaskController } = require("../controller");

const router = Router();

router.get("/", mondayTaskController.getAllMondayTask);

router.post("/", mondayTaskController.createMondayTask);

router.get("/:id", mondayTaskController.getMondayTaskById);

router.put("/update-item", mondayTaskController.updateMondayTask);

router.patch("/update-item-description", mondayTaskController.updateMondayTask);

router.delete("/:id", mondayTaskController.deleteMondayTask);

module.exports = router;
