const express = require('express');
const router = express.Router();
const { index, store, update, show, destroy, selectOptions } = require('../controllers/tag');
const { storeRules, updateRules } = require('../middleware/rules/tag');
const { validate } = require('../middleware/validate');

router.route('/tags')
	.get(index)
	.post([storeRules(), validate], store);

router.route('/tags/:id')
	.get(show)
	.put([updateRules(), validate], update)
	.delete(destroy);

router.get('/tag-select-options', selectOptions);

module.exports = router;
