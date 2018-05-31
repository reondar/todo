var express = require('express');
var router = express.Router();
var auth = require('../auth');

var task_controller = require('../controllers/taskController');

router.get('/', task_controller.task_list);

router.get('/json', task_controller.task_list_json);

router.get('/ongoing', task_controller.task_list_ongoing);

router.get('/completed', task_controller.task_list_completed);

router.get('/task/create', auth.authRequired, task_controller.task_create_get);

router.post('/task/create', auth.authRequired, task_controller.task_create_post);

router.get('/task/:id/delete', auth.authRequired, task_controller.task_delete_get);

router.get('/task/:id/update', auth.authRequired, task_controller.task_update_get);

router.post('/task/:id/update', auth.authRequired, task_controller.task_update_post);

module.exports = router;