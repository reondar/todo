var Task = require("../models/task");
var {body, validationResult} = require("express-validator/check");
var {sanitizeBody} = require("express-validator/filter");

exports.task_list = function (req, res, next) {
      Task.find().exec(function (err, tasks) {
        if (err) return next(err);
        res.render('tasks', { title: 'ToDo list', tasks: tasks});
      });
};

exports.task_list_json = function (req, res, next) {
      Task.find().exec(function(err, tasks){
        if (err) return next(err);
        res.json({tasks: tasks});
      });
};

exports.task_list_ongoing = function (req, res, next) {
      Task.find({ 'status': 'ongoing'}).exec(function (err, tasks) {
        if (err) return next(err);
        res.render('tasks', { title: 'Ongoing tasks', tasks: tasks});
      });
};

exports.task_list_completed = function (req, res, next) {
      Task.find({ 'status': 'completed'}).exec(function (err, tasks) {
        if (err) return next(err);
        res.render('tasks', {title: 'Completed tasks', tasks: tasks});
      });
};

exports.task_create_get = function (req, res, next) {
    res.render('task_form', { title: 'Create new task'});    
};

exports.task_create_post = [
    body('description').isLength({min: 1}).trim().withMessage('Description for the task required'),
    sanitizeBody('description').trim().escape(),
    sanitizeBody('status').escape(),
    (req, res, next) => {
        var errors = validationResult(req);
        var task = new Task({ description: req.body.description, status: req.body.status });
      
        if (!errors.isEmpty()) {
            return res.render('task_form', {title: 'Create new task', task: task, errors: errors.array()});
        }
        task.save(function (err){
            if (err) return next(err);
            res.redirect('/todo/');
        });
    }
];                   

exports.task_delete_get = function(req, res, next) {
    Task.findByIdAndDelete(req.params.id, function(err){
        if (err) {
          var err = new Error('Task not found');
          err.status = 404;
          return next(err);
        }
        res.redirect('/todo/');
    });
};

exports.task_delete_post = function(req,res) {
    res.send("Handle delete task on POST");
};

exports.task_update_get = function(req, res, next) {
    Task.findById(req.params.id).exec(function (err, task){
      if (err){
        var err = new Error('Task not found');
        err.status = 404;
        return next(err);
      }
      if (task==null) {      
        return next(err);
      }
      res.render('task_form', {title: 'Update task', task: task});
    });
};

exports.task_update_post = [
    body('description').isLength({min: 1}).trim().withMessage('Description for the task required'),
    sanitizeBody('description').trim().escape(),
    sanitizeBody('status').escape(),
    (req, res, next) => {
        var errors = validationResult(req);
        var task = new Task({ description: req.body.description, status: req.body.status, _id: req.params.id });
        if (!errors.isEmpty()) {
            return res.render('task_form', {title: 'Update task', task: task, errors: errors.array()});
        }
        Task.findByIdAndUpdate(req.params.id, task, function(err, updatedTask){
            if (err) return next(err);
            res.redirect('/todo/');
        });      
    }
];