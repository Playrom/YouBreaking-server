var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');

var ExtractJwt = require('passport-jwt').ExtractJwt;


var User = require('../models/User');
var Token = require('../models/Token');
var NotificationToken = require('../models/NotificationToken');
var LocationUser = require('../models/LocationUser');


exports.authenticate = [
    passport.authenticate('jwt', { session: false})
];

// Middleware per verificare se i dati vengono modificati dall'utente stesso o da un amministratore
exports.modOrAdmin = [
    passport.authenticate('jwt', { session: false}),
    function(req, res, next){
        console.log(req.user.toJSON().level);
        if(req.user.toJSON().level == "ADMIN" || req.user.toJSON().level == "MOD"){ // Livello 1000 = Admin
            next();
        }else{
            res.status(401).send({error:true,message:"Livello Troppo Basso"})
        }
    }
];

// Middleware per verificare se i dati vengono modificati dall'utente stesso o da un amministratore
exports.authOrAdmin = [
    passport.authenticate('jwt', { session: false}),
    function(req, res, next){
        console.log(req.user.toJSON().level);
        if(req.user.toJSON().level == "ADMIN" || req.user.id == req.params.id){ // Livello 1000 = Admin
            next();
        }else{
            res.status(401).send({error:true,message:"Livello Troppo Basso"})
        }
    }
];

// Middleware per verificare se l'utente è autenticato ,e in tal caso passare il dato
exports.passUser = function(req, res, next){
    passport.authenticate('jwt', { session: false}, function(err, user, info) {
        if(user){
            req.user = user;
        }else{

        }
        next();
    })(req, res, next);
}