const express = require('express');
const { getPendingUsers, updateUserStatus, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/pending', protect, authorize('Manager', 'HO'), getPendingUsers);
router.put('/:id/status', protect, authorize('Manager', 'HO'), updateUserStatus);
router.get('/', protect, authorize('Manager', 'HO'), getAllUsers);

module.exports = router;
