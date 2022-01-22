const express = require("express")
const jobController = require('../api/controllers/job.controller');
const router = express.Router();
router.get('/jobs',jobController.getALl)
      .post('/jobs',jobController.createOne)
      .delete('/jobs/:jobId',jobController.deleteOne)
      .put('/jobs/:jobId',jobController.fullUpdateOne)
      .patch('/jobs/:jobId',jobController.partialUpdateOne);
module.exports = router;