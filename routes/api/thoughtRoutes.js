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
// /api/thoughts/:thoughtsId
router
    .route('/:thoughtsId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought);
// /api/thoughts/:thoughtsId/reaction
router.route('/thoughtsId/reaction').post(addReaction);
// /api/thoughts/:thoughtsId/reaction/:reactionId
router
    .route('/:thoughtsId/reaction/:reactionId')
    .delete(deleteReaction);

module.exports = router;