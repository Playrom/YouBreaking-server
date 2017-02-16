var User = require('../../models/User');
var News = require('../../models/News');
var Voto = require('../../models/Voto');
var NotificationToken = require('../../models/NotificationToken');
var LocationUser = require('../../models/LocationUser');
var haversine = require('haversine');

var utils = require('./utils');

var apn = require('apn');
var production = false;
if(process.env.PRODUCTION == "false"){
    production = false;
}else if(process.env.PRODUCTION == "true"){
    production = true;
}

var options = {
    token: {
        key: process.env.APNKEY,
        keyId: "5VQ8VVZJC8",
        teamId: "33VGWYZGV4"
    },
    production: production
};

var apnProvider = new apn.Provider(options);


var sendNotificationChangeLevel = function(id,level,demoted){
    var apnProvider = new apn.Provider(options);

    NotificationToken
    .where('user_id', id)
    .fetch({withRelated:"user"})
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
                notification.title = "Grande " + user.toJSON()["user"]["name"] + "! Ora sei un " + level;
                notification.body = "Complimenti, i tuoi sforzi sono stati apprezzati e quindi sei salito di livello su You Breaking!";
            }

            notification.payload = {type:"USER_LEVEL_CHANGED"};

            // Actually send the notification
            apnProvider.send(notification, tokens).then(function(result) {  
                // Check the result for any failed devices
                console.log(result);
            });

        }
        
    });
};

var pushToUsers = function(usersToPush,notizia){
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
            notification.payload = {type:"NEWS_NOTIFICATION" , data:notizia};

            // Actually send the notification
            apnProvider.send(notification, tokens).then(function(result) {  
                // Check the result for any failed devices
                console.log(result);
            });

        }
        
    })
};

exports.pushToUsers = pushToUsers;

exports.changeLevel = function(id,oldLevel,newScore){
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
            }else if(newScore < 2){ // DEMOTION AD USER
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


exports.promoteNews = function(idNews){

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
                        totalVoti = totalVoti + utils.valoreVoto(jsonVoti[i].voto);
                    }
                    console.log("Voti Somma " + totalVoti);

                    var percentage = 100 / ( 2 * ( Math.log(count + 1) / Math.log(2) ) );
                    console.log("Percentage " + percentage);

                    var valoreSoglia = (totalVoti / count) / 100 * ( percentage );
                    console.log("Valore Soglia " + valoreSoglia);

                    var valoreNews = 0;
                    News
                    .forge({id : idNews})
                    .fetch({withRelated:['voti','aggiuntivi']})
                    .then(function(notizia){
                        if(notizia){
                            var jsonNotizia = notizia.toJSON();

                            for(var i = 0;i<jsonNotizia["voti"].length;i++){
                                valoreNews = valoreNews + utils.valoreVoto(jsonNotizia["voti"][i].voto);
                            }

                            console.log("Valore News " + valoreNews);


                            if(valoreNews >= valoreSoglia && valoreNews > 0){ // Notizia Approvata
                                notizia.set('live',1);
                                notizia.save()
                                .then(function(salvata){

                                    var json = salvata.toJSON();
                                    json["score"] = valoreNews;

                                    // TROVO GLI UTENTI VICINO
                                    var temp = {};
                                    json["aggiuntivi"].map(function(item){
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

                                                pushToUsers(usersToPush, salvata);

                                            }
                                        })


                                    }

                                    NotificationToken
                                    .where('user_id', json.user_id)
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
                                            notification.body = "La tua notizia con il titolo \"" + json.title + "\" è stata pubblicata";

                                            notification.payload = {type:"NEWS_POSTED" , data : json};
                                            
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
