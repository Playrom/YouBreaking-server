var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/User');
var Token = require('../models/Token');
var NotificationToken = require('../models/NotificationToken');
var LocationUser = require('../models/LocationUser');


exports.getProfile = function(req, res) {
    return res.send({error:false, data: req.user});
};

exports.getUser = function(req, res) {
    if(req.params.id){

        var related = [];
        if(req.query.field){
            related = req.query.field.split(",");
            if(related.includes('notizie')){
                related.push('notizie.aggiuntivi');
                related.push('notizie.evento');
                related.push('notizie.voti');
            }
        }

        var userId = req.params.id;
        User.forge({id:userId})
        .fetch({withRelated:related})
        .then(function(user){
            if(user){
                return res.status(200).send({error:false,data:user.toJSON()});
            }else{
                return res.status(404).send({error:true, message :"Utente Non Trovato"});
            }
        })
    }
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
                    res.status(200).send({error:false});
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


exports.locationNotification = function(req, res) {
    var body = req.body;
    
    if(req.user && body.devicetoken){
        console.log("if");
        NotificationToken.forge({token:body.devicetoken, user_id : req.user.id})
        .fetch()
        .then(function(tk){
            if(tk){
                console.log(tk.toJSON());
                tk.destroy().then(function(old){
                    NotificationToken.forge({token:body.devicetoken, user_id : req.user.id})
                    .save()
                    .then(function(token){
                        console.log(token.toJSON());
                        res.status(200).send();
                    })
                    .catch(function(err){
                        console.log(err);
                        res.status(500).send({error:true,message:err});
                    })

                })
                .catch(function(err){
                    console.log(err);
                    res.status(500).send({error:true,message:err});
                })
            }else{
                NotificationToken.forge({token:body.devicetoken, user_id : req.user.id})
                .save()
                .then(function(token){
                    console.log(token.toJSON());
                    res.status(200).send();
                })
                .catch(function(err){
                    console.log(err);
                    res.status(500).send({error:true,message:err});
                })
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).send({error:true,message:err});
        })
        
        
    }else{
        res.status(404).send({error:true,message:"Utente o Body Non Presente"});

    }
};


exports.userLocation = function(req, res) {

    var body = req.body;
    if(req.user && body.latitude && body.longitude){

        LocationUser.forge({user_id : req.user.id}).fetch().then(function(location){
            if(location){
                var oldLocation = location.toJSON();
                location.destroy().then(function(local){
                    LocationUser.forge({
                        latitude:body.latitude ,
                        longitude : body.longitude || oldLocation.longitude,
                        user_id : req.user.id,
                        place_id : body.place_id || oldLocation.place_id,
                        country : body.country || oldLocation.country,
                        distance : body.distance || oldLocation.distance || null,
                        type : body.type || "None"
                    }).save()
                    .then(function(newLocation){
                        res.status(200).send({err:false, data:newLocation.toJSON()});
                    })
                    .catch(function(err){
                        console.log(err);
                        res.status(500).send({error:true,message:err});
                    })
                })
            }else{
                LocationUser.forge({
                    latitude:body.latitude ,
                    longitude : body.longitude ,
                    user_id : req.user.id,
                    place_id : body.place_id ,
                    country : body.country ,
                    distance : body.distance  || null,
                    type : body.type || "None"
                }).save()
                .then(function(newLocation){
                    res.status(200).send({err:false, data:newLocation.toJSON()});
                })
                .catch(function(err){
                    console.log(err);
                    res.status(500).send({error:true,message:err});
                })
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).send({error:true,message:err});
        })


        

    }else{
        res.status(404).send({error:true,message:"Utente o Body Non Presente"});

    }
};


exports.userLocationDistance = function(req, res) {

    var body = req.body;
    if(req.user){

        LocationUser.forge({user_id : req.user.id}).fetch().then(function(location){
            if(location){
                location.set('distance' , body.distance || null);
                location.save().then(function(local){
                    console.log(local.toJSON());
                    res.status(200).send({err:false, data:local.toJSON()});
                })
                .catch(function(err){
                    console.log(err);
                    res.status(500).send({error:true,message:err});
                })
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).send({error:true,message:err});
        })


        

    }else{
        res.status(404).send({error:true,message:"Utente o Body Non Presente"});

    }
};


exports.deleteUserLocation = function(req, res) {

    if(req.user){

        LocationUser.forge({user_id : req.user.id}).fetch().then(function(location){
            if(location){
                location.destroy()
                .then(function(newLocation){
                    console.log(newLocation.toJSON());
                    res.status(200).send({err:false});
                })
                .catch(function(err){
                    console.log(err);
                    res.status(500).send({error:true,message:err});
                })
            }else{
                res.status(200).send({err:false});
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).send({error:true,message:err});
        })


        

    }else{
        res.status(404).send({error:true,message:"Utente o Body Non Presente"});

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
