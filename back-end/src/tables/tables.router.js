//All routes for the 'tables' resource.

const router = require("express").Router();
const controller = require("./tables.controller");

router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.delete);
router.route("/").get(controller.listTables).post(controller.create);

module.exports = router;
