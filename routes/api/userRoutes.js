const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
} = require('../../controllers/userController');
// /api/user
router.route('/').get(getUsers).post(createUser);
// /api/user/:userId
router
    .route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(deleteUser);
// /api/user/:userId/friend
router.route('/:userId/friend').post(addFriend)
// /api/user/:userId/friends/:friendId
router.route('/:userId/friend/:friendId').delete(deleteFriend);

module.exports = router;