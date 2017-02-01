var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');


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