const express = require('express');
const router = express.Router();

const {
  getAllResidents,
  getResident,
  createResident,
  updateResident,
  deleteResident
} = require('../controllers/residents');

router.route('/').post(createResident).get(getAllResidents);
router.route('/:id').get(getResident).delete(deleteResident).patch(updateResident);

module.exports=router;
