const router = require('express').Router();
const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
} = require('../../controllers/thoughtController');
// /api/thought
router.route('/').get(getThoughts).post(createThought);
// /api/thought/:thoughtsId
router
    .route('/:thoughtId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought);
// /api/thought/:thoughtId/reaction
router.route('/:thoughtId/reaction').post(addReaction);
// /api/thought/:thoughtId/reaction/:reactionId
router
    .route('/:thoughtId/reaction/:reactionId')
    .delete(deleteReaction);

module.exports = router;