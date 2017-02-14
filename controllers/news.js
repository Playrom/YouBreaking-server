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
var NotificationToken = require('../models/NotificationToken');


exports.getNews = function(req, res) {

    var live = 1;

    if(req.query.live){
        if(req.query.live == "false"){
            live = 0;
        }else{
            live =1;
        }
    }

    News
    .forge()
    .where('live',live)
    .orderBy('created_at', 'DESC')
    .fetchAll({withRelated:['aggiuntivi','evento','voti']})
    .then(function(notizie){
        if(notizie){
            var jsonNotizie = notizie.toJSON();

            jsonNotizie.map(function(value,index,arr){
                var score = 1;
                value['voti'].map(function(val,i,a){
                    score = score + utils.valoreVoto(val.voto);
                });
                jsonNotizie[index]["score"] = score;
            })

            if(req.query.sort  && req.query.sort == "hot"){
                jsonNotizie = jsonNotizie.sort(function(first,second){
                    var dateFirst = Date.parse(first.created_at);

                    var dateSecond = Date.parse(second.created_at);

                    var epochFirst = dateFirst;
                    var epochSecond = dateSecond;

                    var scoreFirst = first.score;
                    var scoreSecond = second.score;

                    var orderFirst = Math.log10(Math.max(Math.abs(scoreFirst),1));
                    var orderSecond = Math.log10(Math.max(Math.abs(scoreSecond),1));

                    var signFirst = 0;
                    var signSecond = 0;

                    if(scoreFirst > 0){
                        signFirst = 1;
                    }else if(scoreFirst < 0){
                        signFirst = -1;
                    }

                    if(scoreSecond > 0){
                        signSecond = 1;
                    }else if(scoreSecond < 0){
                        signSecond = -1;
                    }

                    var roundFirst = Math.round(signFirst * orderFirst + epochFirst / 45000);
                    var roundSecond = Math.round(signSecond * orderSecond + epochSecond / 45000);

                    return roundFirst < roundSecond;  
                });
            }else{
                jsonNotizie = jsonNotizie.sort(function(first,second){
                    return first.score < second.score;
                });
            }

            

            jsonNotizie.map(function(val,index,arr){
                delete jsonNotizie[index]["voti"];
            });

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
                res.send({error:false, data:jsonNotizie})
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
        .fetch({withRelated:['aggiuntivi','voti']})
        .then(function(notizie){

            var json = notizie.toJSON();

            var score = 1;
            json['voti'].map(function(val,i,a){
                score = score + utils.valoreVoto(val.voto);
            });
            json["score"] = score;
            delete json.voti;

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

                    var temp = {};
                    aggiunteJson.map(function(item){
                        temp[item.tipo] = item.valore;
                    });

                    if(temp["LOCATION_LATITUDE"] && temp["LOCATION_LONGITUDE"]){
                        var latitude = temp["LOCATION_LATITUDE"];
                        var longitude = temp["LOCATION_LONGITUDE"];

                        var start = {
                            latitude : latitude,
                            longitude : longitude
                        };

                        var usersToPush = [];

                        LocationUser.forge().fetchAll()
                        .then(function(locations){
                            if(locations){
                                var jsonLocations = locations.toJSON();

                                for(var i = 0 ; i < jsonLocations.length ; i++){
                                    var end = {
                                        latitude : jsonLocations[i]["latitude"],
                                        longitude : jsonLocations[i]["longitude"]
                                    };

                                    if(jsonLocations[i].distance){
                                        if(haversine(start, end, { threshold : jsonLocations[i].distance, unit: 'km'}) ) { // Check if In Range
                                            usersToPush.push(jsonLocations[i].user_id);
                                        }
                                    }else{
                                        if(jsonLocations[i].country == temp["LOCATION_COUNTRY"]){
                                            usersToPush.push(jsonLocations[i].user_id);
                                        }
                                    }
                                }

                                notifications.pushToUsers(usersToPush, notizia);

                                res.send({error:false, data:notizia})

                            }else{
                                res.send({error:false, data:notizia})
                            }
                        })


                    }else{
                        res.send({error:false, data:notizia})
                    }

                    
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

