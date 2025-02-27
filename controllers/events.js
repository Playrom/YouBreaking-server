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
var Evento = require('../models/Evento');

exports.getEvents = function(req, res) {

    var related = [];

    if(req.query.fields){
        var fields = req.query.fields;
        if(fields.includes('notizie')){
            related.push('notizie');
        }
    }

    if(req.query.q){
        Evento
        .forge()
        .where('name' , 'LIKE' , '%' + req.query.q + '%')
        .orderBy('created_at', 'DESC')
        .fetchAll({withRelated : related})
        .then(function(eventi){
            if(eventi){
                var jsonEventi = eventi.toJSON();
                var jsonVoti = {};

                if(req.user && related.includes('notizie')){

                    var promises = [];

                    for(var i = 0; i < jsonEventi.length ; i++){
                        var singleEvent = jsonEventi[i]['notizie'];

                        for(var k = 0; k < singleEvent.length ; k++){
                            var singleNotizia = singleEvent[k];

                            promises.push(
                                Voto
                                .forge({user_id : req.user.id,notizia_id : singleNotizia.id})
                                .fetch()
                                .then(function(voto){
                                    if(voto){
                                        var news_id = voto.get('notizia_id');
                                        jsonVoti[news_id] = voto.toJSON();
                                    }
                                })
                            );

                        }
                    }

                    Promise.all(promises)
                    .then(function(result){
                        for(var i = 0; i < jsonEventi.length ; i++){
                            for(var k = 0; k < jsonEventi[i]['notizie'].length ; k++){
                                var singleNotizia = jsonEventi[i]['notizie'][k];
                                var voto = jsonVoti[singleNotizia.id];
                                jsonEventi[i]['notizie'][k]["voto_utente"] = voto;
                            }
                        }
                        res.send({error:false, data:jsonEventi})
                    })

                }else{
                    res.send({error:false, data:eventi.toJSON()})
                }
            }else{
                res.send({error:false, data:[]})
            }
        })
    }else{

        Evento
        .forge()
        .orderBy('created_at', 'DESC')
        .fetchAll({withRelated : related})
        .then(function(eventi){
            if(eventi){
                var jsonEventi = eventi.toJSON();
                var jsonVoti = {};

                if(req.user && related.includes('notizie')){

                    var promises = [];

                    for(var i = 0; i < jsonEventi.length ; i++){
                        var singleEvent = jsonEventi[i]['notizie'];

                        for(var k = 0; k < singleEvent.length ; k++){
                            var singleNotizia = singleEvent[k];

                            promises.push(
                                Voto
                                .forge({user_id : req.user.id,notizia_id : singleNotizia.id})
                                .fetch()
                                .then(function(voto){
                                    if(voto){
                                        var news_id = voto.get('notizia_id');
                                        jsonVoti[news_id] = voto.toJSON();
                                    }
                                })
                            );

                        }
                    }

                    Promise.all(promises)
                    .then(function(result){
                        for(var i = 0; i < jsonEventi.length ; i++){
                            for(var k = 0; k < jsonEventi[i]['notizie'].length ; k++){
                                var singleNotizia = jsonEventi[i]['notizie'][k];
                                var voto = jsonVoti[singleNotizia.id];
                                jsonEventi[i]['notizie'][k]["voto_utente"] = voto;
                            }
                        }
                        res.send({error:false, data:jsonEventi})
                    })

                }else{
                    res.send({error:false, data:eventi.toJSON()})
                }
            }else{
                res.send({error:false, data:[]})
            }
        })
    }
};


exports.getSingleEvent = function(req, res) {

    var related = [];

    if(req.params.id){
        Evento
        .forge({id:req.params.id})
        .fetch()
        .then(function(evento){
            if(evento){
                res.send({error:false, data:evento.toJSON()})
            }else{
                res.send({error:false, data:{}})
            }
        })
    }

    
};

exports.postEvent = function(req, res) {

    if(req.user && req.body){
        var idUtente = req.user.id
        var body = req.body


        Evento.forge({
            name : body.name
        })
        .save()
        .then(function(evento){
            var evento = evento.toJSON();
            res.send({error:false, data:evento})
        })
        .catch(function(err){
            console.log(err);
            res.status(500).send({error:true,message:err.toString()});
        })
    }else{
        res.status(500).send({error:true,message:"Errore Generale"});
    }
};

