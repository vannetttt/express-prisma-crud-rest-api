const express = require('express');
const router = express.Router();
const { index, store, show, update, togglePublish, destroy } = require('../controllers/article');
const { storeRules, updateRules } = require('../middleware/rules/article');
const { validate } = require('../middleware/validate');

router.route('/articles')
	.get(index)
	.post([storeRules(), validate], store);

router.route('/articles/:id')
	.get(show)
	.put([updateRules(), validate], update)
	.delete(destroy);

router.patch('/articles/:id/toggle-publish', togglePublish);

module.exports = router;
