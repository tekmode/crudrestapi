var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var db = mongoose.connection;
var Schema = mongoose.Schema;
var dbUrl = 'mongodb://localhost:27017/emp';
var Employee = Schema({
name: String,
designation:String
});
var Employee = mongoose.model('Employee', Employee);
db.on('error', function () {
console.log('there was an error communicating with the database');
});
mongoose.connect(dbUrl, function (err) {
if (err) {
return console.log('there was a problem connecting to the database!' + err);
}
});
var setpermission = function(req,res,next)
{  
    
        res.setHeader('Access-Control-Allow-Methods', '*')
    
        res.setHeader('Access-Control-Allow-Origin', '*')

//        res.setHeader('Access-Control-Allow-Headers', 'origin, x-requested-with, content-type,Authentication,Accept')
res.setHeader('Access-Control-Allow-Headers', '*')        
        res.setHeader('Access-Control-Allow-Credentials', true);  
next();    
}
router.get('/employees',setpermission, function(req, res, next) {

    Employee.find().sort('name').exec(function(error, results) {
if (error) {
return next(error);
}
// Respond with valid data
res.json(results);
});
});

router.put('/editemp',setpermission, function(req, res, next) {
    
    console.log(req.body.Id);
    console.log(req.body.name);
            Employee.findOneAndUpdate({_id:req.body._id},{name:req.body.name,designation:req.body.designation},function(error, results) {
    if (error) {
    return next(error);
    }
    // Respond with valid data
    res.json(results);
    });
    });
    
router.post('/addemp',setpermission, function(req, res, next) {
    emp= new Employee();
emp.name=req.body.name;
emp.designation=req.body.designation;
        emp.save(function(error, results) {
if (error) {
return next(error);
}
// Respond with valid data
res.json(results);
});
});
router.delete('/delemp/:name',setpermission, function(req, res, next) {
    ename=req.params.name;
Employee.deleteOne({name:ename},function(error, results) {
if (error) {
return next(error);
}
// Respond with valid data
res.json(results);
});
});
router.get('/employees/:name',setpermission, function(req, res, next) {
Employee.findOne({
name: req.params.name
}).populate('Employee').exec(function (error, results) {
if (error) {
return next(error);
}
// If valid user was not found, send 404
if (!results) {
res.status(404).send('No Record Found');
}
else{
// Respond with valid data
res.json(results);
}
});
});
router.get('/', function(req, res, next) {
    res.end("results");
    });
    
    
module.exports = router;
