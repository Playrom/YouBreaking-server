var Promise = require("bluebird");
const haversine = require('haversine')
var notifications = require('./functions/notifications');
var utils = require('./functions/utils');

var User = require('../models/User');
var Token = require('../models/Token');
var News = require('../models/News');
var Voto = require('../models/Voto');
var Aggiunte = require('../models/Aggiunte');
var LocationUser = require('../models/LocationUser');
var Aggiunte = require('../models/Aggiunte');
var LocationUser = require('../models/LocationUser');
var NotificationToken = require('../models/NotificationToken');

exports.postVote = function(req, res) {

    if(req.user && req.body){
        var idUtente = req.user.id;
        var body = req.body;
        console.log(body);

        if(body.notizia_id, body.voto){
            Voto
            .forge({
                user_id : idUtente,
                notizia_id : body.notizia_id
            })
            .fetch({withRelated:['utente']})
            .then(function(vote){

                if(vote){

                    var votoDaInserire = "UP";

                    if(body.voto){
                        if( vote.toJSON().utente.level != "USER"){
                            votoDaInserire = vote.toJSON().utente.level + "_" + body.voto;
                        }else{
                            votoDaInserire = body.voto;
                        }
                    }

                    vote.destroy()
                    .then(function(distrutto){

                        if(body.voto == "NO"){
                            News.forge({id:body.notizia_id}).fetch()
                            .then(function(news){
                                if(news){
                                    var authorID = news.toJSON().user_id;
                                    User.forge({id:authorID}).fetch({withRelated:['notizie','notizie.voti']})
                                    .then(function(author){
                                        if(author){
                                            var score = author.toJSON().score;
                                            notifications.changeLevel(authorID,author.toJSON().level,score);
                                        }
                                    })
                                }
                            })
                            return res.status(200).send({error:false,message:"Voto Cancellato"});
                        }else{
                        
                            Voto
                            .forge({
                                user_id : idUtente,
                                notizia_id : body.notizia_id,
                                voto : votoDaInserire
                            })
                            .save()
                            .then(function(vote){
                                News.forge({id:body.notizia_id}).fetch()
                                .then(function(news){
                                    if(news){
                                        var authorID = news.toJSON().user_id;
                                        User.forge({id:authorID}).fetch({withRelated:['notizie','notizie.voti']})
                                        .then(function(author){
                                            if(author){
                                                var score = author.toJSON().score;
                                                notifications.changeLevel(authorID,author.toJSON().level,score);
                                                if(news.toJSON().live == 0){
                                                    notifications.promoteNews(body.notizia_id);
                                                }
                                            }
                                        })
                                    }
                                })
                                return res.status(200).send({error:false,message:"Voto Sostituito"});
                            })

                        }
                    });
                }else{

                    if(body.voto == "NO"){
                        News.forge({id:body.notizia_id}).fetch()
                        .then(function(news){
                            if(news){
                                var authorID = news.toJSON().user_id;
                                User.forge({id:authorID}).fetch({withRelated:['notizie','notizie.voti']})
                                .then(function(author){
                                    if(author){
                                        var score = author.toJSON().score;
                                        notifications.changeLevel(authorID,author.toJSON().level,score);
                                    }
                                })
                            }
                        })
                        return res.status(200).send({error:false,message:"Voto Cancellato"});
                    }else{

                        User.forge({id:idUtente}).fetch().then(function(votante){
                            if(votante){
                                var votoDaInserire = "UP";

                                if(body.voto){
                                    if( votante.toJSON().level != "USER"){
                                        votoDaInserire = votante.toJSON().level + "_" + body.voto;
                                    }else{
                                        votoDaInserire = body.voto;
                                    }
                                }

                                Voto
                                .forge({
                                    user_id : idUtente,
                                    notizia_id : body.notizia_id,
                                    voto : votoDaInserire
                                })
                                .save()
                                .then(function(vote){
                                    News.forge({id:body.notizia_id}).fetch()
                                    .then(function(news){
                                        if(news){
                                            var authorID = news.toJSON().user_id;
                                            User.forge({id:authorID}).fetch({withRelated:['notizie','notizie.voti']})
                                            .then(function(author){
                                                if(author){
                                                    var score = author.toJSON().score;
                                                    notifications.changeLevel(authorID,author.toJSON().level,score);
                                                    if(news.toJSON().live == 0){
                                                        notifications.promoteNews(body.notizia_id);
                                                    }
                                                }
                                            })
                                        }
                                    })
                                    return res.status(200).send({error:false,message:"Voto Inserito"});
                                })

                                
                            }
                        })

                    }

                    
                }

            });
        }

        
    }
};


exports.getWaitVotesUser = function(req, res) {
    News
    .where('live',0)
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
                    
                    json = jsonNotizie.filter(function(item) { 
                        if(notizieConVoto.includes(item.id)){
                            return false;
                        }else{
                            return true;
                        }
                    });
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
