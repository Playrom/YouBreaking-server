var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Promise = require("bluebird");
var ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/User');
var Token = require('../models/Token');
var News = require('../models/News');
var Voto = require('../models/Voto');
var Aggiunte = require('../models/Aggiunte');


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

// Middleware per verificare se l'utente è autenticato ,e in tal caso passare il dato
exports.passUser = function(req, res, next){
    passport.authenticate('jwt', { session: false}, function(err, user, info) {
        if(user){
            req.user = user;
        }
        next();
    })(req, res, next);
}

exports.getNews = function(req, res) {
    News
    .forge()
    .orderBy('created_at', 'DESC')
    .fetchAll({withRelated:['aggiuntivi','evento']})
    .then(function(notizie){
        if(notizie){
            var jsonNotizie = notizie.toJSON();
            var jsonVoti = {};

            if(req.user){

                var promises = [];

                for(var i = 0; i < jsonNotizie.length ; i++){
                    var single = jsonNotizie[i];
                    promises.push(
                        Voto
                        .forge({user_id : req.user.id,notizia_id : single.id})
                        .fetch()
                        .then(function(voto){
                            if(voto){
                                var news_id = voto.get('notizia_id');
                                jsonVoti[news_id] = voto.toJSON();
                            }
                        })
                    );
                }

                Promise.all(promises)
                .then(function(result){
                    for(var i = 0; i < jsonNotizie.length ; i++){
                        var temp = jsonNotizie[i];
                        var voto = jsonVoti[temp.id];
                        jsonNotizie[i]["voto_utente"] = voto;
                    }
                    res.send({error:false, data:jsonNotizie})
                })

            }else{
                res.send({error:false, data:notizie.toJSON()})
            }
        }else{
            res.send({error:false, data:[]})
        }
    })
};

exports.getSingleNews = function(req, res) {

    if(req.params.id){
        News
        .forge({id:req.params.id})
        .fetch({withRelated:['aggiuntivi']})
        .then(function(notizie){

            var json = notizie.toJSON();

            if(req.user){
                var userId = req.user.id;
                Voto
                .forge({user_id : userId,notizia_id : json.id})
                .fetch()
                .then(function(voto){
                    if(voto){
                        json["voto_utente"] = voto.toJSON();
                    }
                    res.send({error:false,data : json});
                })
            }else{
                res.send({error:false, data:json})
            }
        })
        .catch(function(err){
            res.status(404).send({error:true, message:"Post Non Trovato"});
        });
    }
};

exports.postNews = function(req, res) {

    if(req.user && req.body){
        var idUtente = req.user.id
        var body = req.body


        News.forge({
            user_id : idUtente ,
            title : body.title || "",
            text : body.text || "",
            event_id : body.eventId || null
        })
        .save()
        .then(function(news){
            var notizia = news.toJSON();
            var aggiunteJson = [];

            if(body.aggiuntivi){

                var agg = body.aggiuntivi;

                var promises = [];

                for(var i = 0; i < agg.length ; i++){
                    var single = agg[i];
                    promises.push(
                        Aggiunte
                        .forge({notizia_id : notizia.id, tipo : single.tipo, valore : single.valore })
                        .save()
                        .then(function(aggiunta){
                            if(aggiunta){
                                var news_id = aggiunta.get('notizia_id');
                                aggiunteJson.push(aggiunta.toJSON());
                            }
                        })
                    );
                }

                Promise.all(promises)
                .then(function(result){
                    notizia["aggiunte"] = aggiunteJson
                    res.send({error:false, data:notizia})
                })

            }else{
                res.send({error:false, data:notizie.toJSON()})
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).send({error:true,message:err.toString()});
        })
    }else{
        res.status(500).send({error:true,message:"Errore Generale"});
    }
};


exports.postVote = function(req, res) {

    if(req.user && req.body){
        var idUtente = req.user.id;
        var body = req.body;

        if(body.notizia_id, body.voto){
            Voto
            .forge({
                user_id : idUtente,
                notizia_id : body.notizia_id
            })
            .fetch()
            .then(function(vote){

                if(vote){
                    vote.destroy()
                    .then(function(distrutto){

                        if(body.voto == "NO"){
                            return res.status(200).send({error:false,message:"Voto Cancellato"});
                        }
                        
                        Voto
                        .forge({
                            user_id : idUtente,
                            notizia_id : body.notizia_id,
                            voto : body.voto
                        })
                        .save()
                        .then(function(vote){
                            return res.status(200).send({error:false,message:"Voto Sostituito"});
                        })
                    });
                }else{

                    if(body.voto == "NO"){
                        return res.status(200).send({error:false,message:"Voto Cancellato"});
                    }

                    Voto
                    .forge({
                        user_id : idUtente,
                        notizia_id : body.notizia_id,
                        voto : body.voto
                    })
                    .save()
                    .then(function(vote){
                            return res.status(200).send({error:false,message:"Voto Inserito"});
                    })
                }

            });
        }

        
    }
};


exports.getWaitVotesUser = function(req, res) {
    News
    .forge()
    .orderBy('created_at', 'DESC')
    .fetchAll({withRelated:['aggiuntivi','evento']})
    .then(function(notizie){
        if(notizie){
            var jsonNotizie = notizie.toJSON();
            var notizieConVoto = [];

            if(req.user){

                var promises = [];

                for(var i = 0; i < jsonNotizie.length ; i++){
                    var single = jsonNotizie[i];
                    promises.push(
                        Voto
                        .forge({user_id : req.user.id,notizia_id : single.id})
                        .fetch()
                        .then(function(voto){
                            if(voto){
                                var news_id = voto.get('notizia_id');
                                notizieConVoto.push(news_id);
                            }
                        })
                    );
                }

                Promise.all(promises)
                .then(function(result){
                    var json = jsonNotizie;
                    for(var i = 0; i < notizieConVoto.length ; i++){
                        var idNotizia = notizieConVoto[i];
                        json = jsonNotizie.filter(function(item) { 
                            return item.id !== idNotizia;  
                        });
                    }
                    res.send({error:false, data:json})
                })

            }else{
                res.send({error:true, message : "UTENTE NON IDENTIFICATO"});
            }
        }else{
            res.send({error:false, data:[]})
        }
    })
};
