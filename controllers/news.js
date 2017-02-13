var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Promise = require("bluebird");
var ExtractJwt = require('passport-jwt').ExtractJwt;
const haversine = require('haversine')

var User = require('../models/User');
var Token = require('../models/Token');
var News = require('../models/News');
var Voto = require('../models/Voto');
var Aggiunte = require('../models/Aggiunte');
var LocationUser = require('../models/LocationUser');
var NotificationToken = require('../models/NotificationToken');

var apn = require('apn');
var options = {
    token: {
        key: "/Users/playrom/Projects/Tesi/apnkey.p8",
        keyId: "5VQ8VVZJC8",
        teamId: "33VGWYZGV4"
    },
    production: false
};

var apnProvider = new apn.Provider(options);

exports.authenticate = [
    passport.authenticate('jwt', { session: false})
];

// Middleware per verificare se i dati vengono modificati dall'utente stesso o da un amministratore
exports.authOrAdmin = [
    passport.authenticate('jwt', { session: false}),
    function(req, res, next){
        if(req.user.toJSON().level == "ADMIN"  || req.user.id == req.params.id){ // Livello 1000 = Admin
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
                    score = score + valoreVoto(val.voto);
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
                score = score + valoreVoto(val.voto);
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

                                console.log(usersToPush);

                                

                                NotificationToken
                                .where('user_id', 'IN', usersToPush)
                                .fetchAll()
                                .then(function(usersPushing){
                                    if(usersPushing){

                                        var tokens = usersPushing.toJSON().map(function(item){
                                            return item["token"];
                                        })

                                        // Prepare a new notification
                                        var notification = new apn.Notification();

                                        // Specify your iOS app's Bundle ID (accessible within the project editor)
                                        notification.topic = 'com.giorgioromano.news.youbreaking';

                                        // Set expiration to 1 hour from now (in case device is offline)
                                        notification.expiry = Math.floor(Date.now() / 1000) + 3600;

                                        // Set app badge indicator
                                        //notification.badge = 0;

                                        // Play ping.aiff sound when the notification is received
                                        notification.sound = 'ping.aiff';

                                        // Display the following message (the actual notification text, supports emoji)
                                        notification.title = notizia["title"];
                                        notification.body = notizia["text"];

                                        // Send any extra payload data with the notification which will be accessible to your app in didReceiveRemoteNotification
                                        notification.payload = notizia;

                                        // Actually send the notification
                                        apnProvider.send(notification, tokens).then(function(result) {  
                                            // Check the result for any failed devices
                                            console.log(result);
                                        });

                                    }

                                    res.send({error:false, data:notizia})
                                    
                                })


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
                                            changeLevel(authorID,author.toJSON().level,score);
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
                                                changeLevel(authorID,author.toJSON().level,score);
                                                promoteNews(body.notizia_id);
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
                                        changeLevel(authorID,author.toJSON().level,score);
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
                                                    changeLevel(authorID,author.toJSON().level,score);
                                                    promoteNews(body.notizia_id);
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

var sendNotificationChangeLevel = function(id,level,demoted){
    var apnProvider = new apn.Provider(options);

    NotificationToken
    .where('user_id', id)
    .fetch()
    .then(function(user){
        if(user){

            var tokens = user.toJSON()["token"];

            // Prepare a new notification
            var notification = new apn.Notification();

            // Specify your iOS app's Bundle ID (accessible within the project editor)
            notification.topic = 'com.giorgioromano.news.youbreaking';

            // Set expiration to 1 hour from now (in case device is offline)
            notification.expiry = Math.floor(Date.now() / 1000) + 3600;

            // Set app badge indicator
            //notification.badge = 0;

            // Play ping.aiff sound when the notification is received
            notification.sound = 'ping.aiff';

            if(demoted){
                notification.title = "Il Tuo Livello è diminuito";
                notification.body = "Hai ricevuto troppi voti negativi, il tuo livello su You Breaking ora è " + level;
            }else{
                notification.title = "Grande " + user.username + "! Ora sei un " + level;
                notification.body = "Complimenti, i tuoi sforzi sono stati apprezzati e quindi sei salito di livello su You Breaking!";
            }

            // Actually send the notification
            apnProvider.send(notification, tokens).then(function(result) {  
                // Check the result for any failed devices
                console.log(result);
            });

        }
        
    });
};

var changeLevel = function(id,oldLevel,newScore){
    switch (oldLevel) {
        case "USER":
            if(newScore > 2){ // PROMUOVI AD AUTORE
                User.forge({id:id}).save('level','AUTHOR')
                .then(function(user){
                    sendNotificationChangeLevel(id,"Autore",false);
                })
                .catch(function(err){
                    console.log(err);
                });
            }
        break;
        case "AUTHOR":
            if(newScore > 500){ // PROMUOVI AD AUTORE
                User.forge({id:id}).save('level','EDITOR')
                .then(function(user){
                    sendNotificationChangeLevel(id,"Editor",false);
                })
                .catch(function(err){
                    console.log(err);
                });
            }else if(newScore < 25){ // DEMOTION AD USER
                User.forge({id:id}).save('level','USER')
                .then(function(user){
                    sendNotificationChangeLevel(id,"Utente",true);
                })
                .catch(function(err){
                    console.log(err);
                });
            }
        break;
        case "EDITOR":
            if(newScore < 400){ // PROMUOVI AD AUTORE
                User.forge({id:id}).save('level','AUTHOR')
                .then(function(user){
                    sendNotificationChangeLevel(id,"Autore",true);
                })
                .catch(function(err){
                    console.log(err);
                });
            }
        break;
        default:
        break;
    }
};

var promoteNews = function(idNews){

    var totalVoti = 1;
    
    User
    .count()
    .then(function(count){
        if(count){
            console.log("Numero Utenti " + count);
            Voto
            .forge()
            .fetchAll()
            .then(function(voti){
                if(voti){
                    var jsonVoti = voti.toJSON();
                    for(var i = 0;i<jsonVoti.length;i++){
                        totalVoti = totalVoti + valoreVoto(jsonVoti[i].voto);
                    }
                    console.log("Voti Somma " + totalVoti);

                    var percentage = 100 / ( 2 * ( Math.log(count + 1) / Math.log(2) ) );
                    console.log("Percentage " + percentage);

                    var valoreSoglia = (totalVoti / count) / 100 * ( percentage );
                    console.log("Valore Soglia " + valoreSoglia);

                    var valoreNews = 0;
                    News
                    .forge({id : idNews})
                    .fetch({withRelated:['voti']})
                    .then(function(notizia){
                        if(notizia){
                            var jsonNotizia = notizia.toJSON();

                            for(var i = 0;i<jsonNotizia["voti"].length;i++){
                                valoreNews = valoreNews + valoreVoto(jsonNotizia["voti"][i].voto);
                            }

                            console.log("Valore News " + valoreNews);


                            if(valoreNews >= valoreSoglia && valoreNews > 0){ // Notizia Approvata
                                notizia.set('live',1);
                                notizia.save()
                                .then(function(salvata){

                                    console.log(salvata.toJSON());

                                    NotificationToken
                                    .where('user_id', salvata.toJSON().user_id)
                                    .fetch()
                                    .then(function(user){

                                        if(user){

                                            var tokens = user.toJSON()["token"];

                                            // Prepare a new notification
                                            var notification = new apn.Notification();

                                            // Specify your iOS app's Bundle ID (accessible within the project editor)
                                            notification.topic = 'com.giorgioromano.news.youbreaking';

                                            // Set expiration to 1 hour from now (in case device is offline)
                                            notification.expiry = Math.floor(Date.now() / 1000) + 3600;

                                            // Set app badge indicator
                                            notification.badge = 0;

                                            // Play ping.aiff sound when the notification is received
                                            notification.sound = 'ping.aiff';

                                            // Display the following message (the actual notification text, supports emoji)
                                            notification.title = "La tua notizia è stata pubblicata!";
                                            notification.body = "La tua notizia con il titolo \"" + salvata.toJSON().title + "\" è stata pubblicata";

                                            // Actually send the notification
                                            apnProvider.send(notification, tokens).then(function(result) {  
                                                // Check the result for any failed devices
                                                console.log(result);
                                            });

                                        }
                                        
                                    });
                                });
                            }
                        }
                    });

                }
            });

        }
    });
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

var valoreVoto = function(voto){
    switch (voto) {
        case "UP":
        return 1 ;
        break;
        case "AUTHOR_UP":
        return 2 ;
        break;
        case "EDITOR_UP":
        return 3 ;
        break;
        case "MOD_UP":
        return 5 ;
        break;
        case "ADMIN_UP":
        return 5 ;
        break;
        case "DOWN":
        return - 1 ;
        break;
        case "AUTHOR_DOWN":
        return - 2 ;
        break;
        case "EDITOR_DOWN":
        return - 3 ;
        break;
        case "MOD_DOWN":
        return - 5 ;
        break;
        case "ADMIN_DOWN":
        return - 5 ;
        break;
        default:
        break;
    }
}