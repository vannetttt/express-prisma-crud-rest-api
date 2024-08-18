const express = require('express');
const router = express.Router();
const { index, store, show, update, destroy, authorSelectOptions } = require('../controllers/user.controllers');
const { storeRules, updateRules } = require('../middleware/rules/user.middleware');
const { validate } = require('../middleware/validate.middleware');
const { checkIfAdmin } = require('../middleware/is-admin.middleware');

router.route('/users')
	.get(index)
	.post([checkIfAdmin, storeRules(), validate], store);

router.route('/users/:id')
	.get(show)
	.put([checkIfAdmin, updateRules(), validate], update)
	.delete(checkIfAdmin, destroy);

router.get('/author-select-options', authorSelectOptions);

module.exports = router;
