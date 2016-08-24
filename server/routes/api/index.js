// Get the router
var apirouter = require('express').Router();
var scriptorController = require('../../controllers/scriptor.server.controller');
var xpathController = require('../../controllers/xpath.server.controller');

// Middleware for all this apirouters requests
apirouter.use(function timeLog(req, res, next) {
  console.log('Request Received: ', dateDisplayed(Date.now()));
  next();
});

// Welcome message for a GET at http://localhost:8080/restapi
apirouter.get('/', function(req, res) {
    var rand = Math.random() * (9999999 - 9999) + 9999;
    res.writeHead(301,
        {Location: 'https://apiui.herokuapp.com?https://raw.githubusercontent.com/sim5runner/runner-v2/master/server/routes/api/docs/swagger.json&' + rand }
    );
    res.end();
});



apirouter.post('/tasks', scriptorController.saveTask);
apirouter.put('/tasks', scriptorController.updateTask);

apirouter.get('/tasks/:task_id', scriptorController.getTaskScript);
apirouter.put('/tasks/:task_id', scriptorController.updateTaskScript);

apirouter.get('/tasks', scriptorController.getAllTasks);
apirouter.delete('/tasks/:task_id', scriptorController.deleteTaskScript);

/**
 * api for xpath functionality
 *
 * xpath are unique at application level, different applications can have xpath with same key
 * user is restricted to update / delete key of existing xpath
 * user is able to update value of xpath with notification on basis of taskid tags
 */

// add xpath: error on existing xpath key for app
apirouter.post('/xpath', xpathController.addXpath);

// get all xpath
apirouter.get('/xpath', xpathController.getXpaths);

// get xpath for app_type
apirouter.get('/xpath/:app_type', xpathController.getApplicationXpaths);

// get xpath: by key + app_type
apirouter.get('/xpath/:app_type/:xpath_key', xpathController.getApplicationXpathValue);

// update xpath: update xpath value + add task_id tag (no duplicates)
apirouter.put('/xpath/:app_type/:xpath_key', xpathController.updateApplicationXpath);

module.exports = apirouter;

function dateDisplayed(timestamp) {
    var date = new Date(timestamp);
    return (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
}
