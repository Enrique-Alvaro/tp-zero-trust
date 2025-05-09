const express = require('express');
const { getLogs, getUsers } = require('../controllers/adminController');
const router = express.Router();

router.get('/logs', (req, res) => {
  console.log("🔧 GET /api/admin/logs llamado");
  getLogs(req, res);
});

router.get('/users', (req, res) => {
  console.log("🔧 GET /api/admin/users llamado");
  getUsers(req, res);
});

module.exports = router;


