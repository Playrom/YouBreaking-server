var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');

var ExtractJwt = require('passport-jwt').ExtractJwt;


var User = require('../models/User');
var Token = require('../models/Token');


exports.authenticate = [
    passport.authenticate('jwt', { session: false})
];

// Middleware per verificare se i dati vengono modificati dall'utente stesso o da un amministratore
exports.authOrAdmin = [
    passport.authenticate('jwt', { session: false}),
    function(req, res, next){
        console.log(req.user.toJSON().level);
        if(req.user.toJSON().level > 999 || req.user.id == req.params.id){ // Livello 1000 = Admin
            next();
        }else{
            res.status(401).send({error:true,message:"Livello Troppo Basso"})
        }
    }
];

exports.getProfile = function(req, res) {
    return res.send(req.user);
};

exports.editProfile = function(req, res) {

    var idDaModificare = req.params.id;
    var idModificante = req.user.id

    console.log("Id Da Modificare : " + idDaModificare);
    console.log("Id Modificante : " + idModificante);

    if(idDaModificare){

        var body = req.body;
        console.log(body);

        User.forge({id:idDaModificare}).fetch()
        .then(function(user){

            if(user){

                user.set('name' , body.name || user.name);
                user.set('email' , body.email || user.email);
                user.save()
                .then(function(user){
                    res.status(200).send();
                })

            }else{
                res.status(404).send({error:true,message:"Utente Non Trovato"});
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).send({error:true,message:err});
        })

    }else{

        res.status(404).send({error:true,message:"Parametro ID Non Presente"});

    }
};

/**
 *  /logout
 */
exports.logout = function(req, res) {
    var user = req.user;

    if(user){

        var extractor = ExtractJwt.fromAuthHeader();
        var token = extractor(req);
        console.log(token);
        var id = user.id;
        new Token({token : token })
        .fetch()
        .then(function(token) {
            new Token({id : token.id })
            .destroy()
            .then(function(token) {
                res.status(200).send();
            })
            .catch(function(err){
                res.status(500).send({error:true,message:"Token Trovato : Impossibile Effettuare il Logout",stamp:err});
            })
        })
        .catch(function(err){
            res.status(500).send({error:true,message:"Token Non Trovato : Impossibile Effettuare il Logout",stamp:err});
        });
    }else{
        res.status(404).send({error:true,message:"Utente non Verificato"});
    }
};
