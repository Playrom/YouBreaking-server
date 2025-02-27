var fs = require('fs');
var path = require('path');

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

    var Data = News.forge();

    if(req.query.live){
        if(req.query.live == "false"){
            Data = Data.where('live',0)
        }else if(req.query.live == "true"){
            Data = Data.where('live',1)
        }
    }

    if(req.query.event){
        Data = Data.where('event_id','LIKE',req.query.event);
    }

    if(req.query.author){
        Data = Data.where('user_id','LIKE',req.query.author);
    }

    var page = 1;
    var pageSize = 5;
    var total = 0;
    var pages = 0;

    if(req.query.page){
        page = parseInt(req.query.page);
    }

    if(req.query.pageSize){
        pageSize = parseInt(req.query.pageSize);
    }

    var startLimit = (pageSize * ( page - 1) );
    var endLimit = (pageSize * page ) ;

    if(req.query.startDate || req.query.endDate){
        if(req.query.startDate){
            var date = new Date(req.query.startDate*1000);
            var mysqlDate = date.toISOString().slice(0, 19).replace('T', ' ');
            Data = Data.where('created_at', '>', mysqlDate);
        }
        if(req.query.endDate){
            var date = new Date(req.query.endDate*1000);
            var mysqlDate = date.toISOString().slice(0, 19).replace('T', ' ');
            Data = Data.where('created_at', '<', mysqlDate);
        }
    }else{
        if(req.query.dateLimit){
            var now = new Date();
            var date = now;
            date.setDate(date.getDate()-4);
            var mysqlDate = date.toISOString().slice(0, 19).replace('T', ' ');
            Data = Data.where('created_at', '>', mysqlDate);
        }    
    }

    Data
    .orderBy('created_at', 'DESC')
    .fetchAll({withRelated:['aggiuntivi','evento','voti','user']})
    .then(function(notizie){
        if(notizie){
            var jsonNotizie = notizie.toJSON();

            jsonNotizie.map(function(value,index,arr){
                var score = 0;
                value['voti'].map(function(val,i,a){
                    score = score + utils.valoreVoto(val.voto);
                });
                jsonNotizie[index]["score"] = score;
            })

            if(req.query.sort  && req.query.sort == "hot"){

                if(req.query.longitude && req.query.latitude){

                    var longitudeUser = req.query.longitude;
                    var latitudeUser = req.query.latitude;

                    jsonNotizie.map(function(value,index,arr){
                        var distance = 0;

                        var temp = {};
                        value["aggiuntivi"].map(function(item){
                            temp[item.tipo] = item.valore;
                        });

                        if(temp["LOCATION_LATITUDE"] && temp["LOCATION_LONGITUDE"]){
                            var latitude = temp["LOCATION_LATITUDE"];
                            var longitude = temp["LOCATION_LONGITUDE"];

                            var start = {
                                latitude : latitude,
                                longitude : longitude
                            };

                            var end = {
                                latitude : latitudeUser,
                                longitude : longitudeUser
                            };

                            distance = haversine(start, end, {  unit: 'km'})
                        }else{
                            distance = 100;
                        }

                        jsonNotizie[index]["distance"] = distance;

                    });

                }

                jsonNotizie = jsonNotizie.map(function(first,index,arr){
                    var dateFirst = Date.parse(first.created_at);

                    var epochFirst = dateFirst / 1000;

                    var scoreFirst = first.score;

                    var orderFirst =  Math.log10(Math.max(Math.abs(scoreFirst),1)) ;

                    var signFirst = 0;

                    if(scoreFirst > 0){
                        signFirst = 1;
                    }else if(scoreFirst < 0){
                        signFirst = -1;
                    }
                    
                    if(req.query.longitude && req.query.latitude){

                        if(first.distance < 1){
                            first.distance = 1;
                        }

                        var roundFirst =  ( signFirst * orderFirst / Math.log10(1 + first.distance) +  ( epochFirst /  45000   ) ) ;
                        first.round_score = roundFirst;
                        //console.log(first.title + ": " + roundFirst);
                        return first;

                    }else{
                        var roundFirst = Math.round(signFirst * orderFirst +  ( epochFirst / 45000 ) );
                        first.round_score = roundFirst;
                        //console.log(first.title + ": " + roundFirst);
                        return first;
                    }

                    
                });

                jsonNotizie = jsonNotizie.sort(function(first,second){
                    
                    if(first.round_score > second.round_score){
                        return -1
                    }else if(first.round_score < second.round_score){
                        return 1;
                    }else{
                        return 0;
                    } 

                    
                });
            }else if(req.query.sort  && req.query.sort == "recent"){
                jsonNotizie = jsonNotizie.sort(function(first,second){
                    var dateFirst = Date.parse(first.created_at);

                    var dateSecond = Date.parse(second.created_at);

                    var epochFirst = dateFirst;
                    var epochSecond = dateSecond;

                    if(dateFirst > dateSecond){
                        return -1
                    }else if(dateFirst < dateSecond){
                        return 1;
                    }else{
                        return 0;
                    }  
                });
            }else if(req.query.sort && req.query.sort == "location" && req.query.longitude && req.query.latitude){
                var longitudeUser = req.query.longitude;
                var latitudeUser = req.query.latitude;

                jsonNotizie.map(function(value,index,arr){
                    var distance = 0;

                    var temp = {};
                    value["aggiuntivi"].map(function(item){
                        temp[item.tipo] = item.valore;
                    });

                    if(temp["LOCATION_LATITUDE"] && temp["LOCATION_LONGITUDE"]){
                        var latitude = temp["LOCATION_LATITUDE"];
                        var longitude = temp["LOCATION_LONGITUDE"];

                        var start = {
                            latitude : latitude,
                            longitude : longitude
                        };

                        var end = {
                            latitude : latitudeUser,
                            longitude : longitudeUser
                        };

                        distance = haversine(start, end, {  unit: 'km'})
                    }else{
                        distance = 1000000;
                    }

                    jsonNotizie[index]["distance"] = distance;

                });

                jsonNotizie = jsonNotizie.sort(function(first,second){
                    if(first.distance > second.distance){
                        return 1
                    }else if(first.distance < second.distance){
                        return -1;
                    }else{
                        return 0;
                    }
                });
            }else if(req.query.sort && req.query.sort == "score"){
                jsonNotizie = jsonNotizie.sort(function(first,second){
                    if(first.score > second.score){
                        return -1
                    }else if(first.score < second.score){
                        return 1;
                    }else{
                        return 0;
                    }
                });
            }else{
                jsonNotizie = jsonNotizie.sort(function(first,second){
                    if(first.score > second.score){
                        return -1
                    }else if(first.score < second.score){
                        return 1;
                    }else{
                        return 0;
                    }
                });
            }

            total = jsonNotizie.length;
            pages = Math.ceil( ( total / pageSize ));

            jsonNotizie = jsonNotizie.slice(startLimit,endLimit);
            

            jsonNotizie.map(function(val,index,arr){
                if(val["distance"] == 100){
                    delete jsonNotizie[index]["distance"];
                }
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
                    res.send({error:false, data:jsonNotizie, pagination:{page:page,pageSize : pageSize, pages : pages, total:total} })
                })

            }else{
                res.send({error:false, data:jsonNotizie , pagination:{page:page,pageSize : pageSize, pages : pages, total:total} })
            }
        }else{
            res.send({error:false, data:[] , pagination:{page:page,pageSize : pageSize, pages : pages, total:total} })
        }
    })
};

exports.getSingleNews = function(req, res) {

    if(req.params.id){
        News
        .forge({id:req.params.id})
        .fetch({withRelated:['aggiuntivi','voti','voti.user','user','evento']})
        .then(function(notizie){

            var json = notizie.toJSON();

            var score = 1;
            json['voti'].map(function(val,i,a){
                score = score + utils.valoreVoto(val.voto);
            });
            json["score"] = score;

            if(req.query.fields){
                var fields = req.query.fields.split(',');
                if(!fields.includes('voti')){
                    delete json.voti;
                }
            }else{
                delete json.voti;
            }


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
            console.log(err);
            res.status(404).send({error:true, message:"Post Non Trovato"});
        });
    }
};


exports.promote = function(req, res) {

    if(req.params.id){
        News
        .forge({id:req.params.id})
        .save('live',1)
        .then(function(notizia){

            if(notizia){
                return res.status(200).send({error:false});
            }else{
            res.status(404).send({error:true, message:"Post Non Trovato"});
            }
        })
        .catch(function(err){
            res.status(404).send({error:true, message:"Post Non Trovato"});
        });
    }
};

exports.delete = function(req, res) {

    if(req.params.id){

        News
        .forge({id:req.params.id})
        .fetch()
        .then(function(notizia){

            if(notizia){

                if(req.user.toJSON().level == "ADMIN" || req.user.toJSON().level == "MOD" || req.user.toJSON().id == notizia.toJSON().user_id){ // Livello 1000 = Admin
                    notizia.destroy().then(function(distrutta){
                        return res.status(200).send({error:false});
                    });
                }else{
                        return res.status(400).send({error:true,message:"Unauthorized"})
                }
            }else{
                res.status(404).send({error:true, message:"Post Non Trovato"});
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

        var data = {
            user_id : idUtente ,
            title : body.title || "",
            text : body.text || "",
            event_id : body.eventId || null
        }

        var user = req.user.toJSON()

        if(user.level == "EDITOR" || user.level == "MOD" || user.level == "ADMIN"){
            data["live"] = 1;
        }

        News.forge(data)
        .save()
        .then(function(news){
            var notizia = news.toJSON();
            var aggiunteJson = [];

            if(body.aggiuntivi){

                var agg = body.aggiuntivi;

                var promises = [];

                for(var i = 0; i < agg.length ; i++){
                    var single = agg[i];

                    if(single.tipo == "PHOTO" || single.tipo == "FEATURED_PHOTO"){

                        var img = single.valore;
                        var buf = new Buffer(img, 'base64');

                        promises.push(
                            Aggiunte
                            .forge({notizia_id : notizia.id, tipo: single.tipo})
                            .save()
                            .then(function(aggiunta){
                                if(aggiunta){
                                    var idPhoto = aggiunta.id;
                                    var photoPath = null;
                                    // Save base64 image to disk
                                    try{
                                        // Decoding base-64 image
                                        // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
                                        function decodeBase64Image(dataString){
                                            var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                                            var response = {};

                                            if (matches.length !== 3){
                                                return new Error('Invalid input string');
                                            }

                                            response.type = matches[1];
                                            response.data = new Buffer(matches[2], 'base64');

                                            return response;
                                        }

                                        // Regular expression for image type:
                                        // This regular image extracts the "jpeg" from "image/jpeg"
                                        var imageTypeRegularExpression      = /\/(.*?)$/;      

                                        var base64Data = img;

                                        var imageBuffer                      = decodeBase64Image(base64Data);
                                        var userUploadedFeedMessagesLocation = path.join(__dirname, '../public/photos/')

                                        var uniqueRandomImageName            =  idPhoto;
                                        // This variable is actually an array which has 5 values,
                                        // The [1] value is the real image extension
                                        var imageTypeDetected                = imageBuffer
                                                                                .type
                                                                                .match(imageTypeRegularExpression);

                                        var userUploadedImagePath            = userUploadedFeedMessagesLocation + 
                                                                            uniqueRandomImageName +
                                                                            '.' + 
                                                                            imageTypeDetected[1];

                                        photoPath =  uniqueRandomImageName + '.' + imageTypeDetected[1];

                                        // Save decoded binary image to disk
                                        try{
                                            require('fs').writeFile(userUploadedImagePath, imageBuffer.data, function(){
                                                console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                                            });
                                        }catch(error) {
                                            console.log('ERROR:', error);
                                        }

                                    }catch(error){
                                        photoPath = idPhoto + ".jpeg";
                                        fs.writeFileSync(path.join(__dirname, '../public/photos/' , idPhoto + ".jpeg"), buf, function(err) {
                                            if (err) throw err;
                                            console.log("Wrote sitemap to XML");
                                        });
                                    }
                                    
                                    var singleJson = aggiunta.toJSON();
                                    singleJson["valore"] = photoPath;

                                    aggiunteJson.push(singleJson);

                                    aggiunta.save({tipo : singleJson.tipo, valore : photoPath}).then(function(saved){

                                    })


                                }
                            })
                        );
                    }else{

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
                }

                Promise.all(promises)
                .then(function(result){
                    notizia["aggiuntivi"] = aggiunteJson;
                    notizia["score"] = 0;

                    if(user.level == "EDITOR" || user.level == "MOD" || user.level == "ADMIN"){
                        if(req.body.notification == "GLOBAL" || req.body.notification == "LOCAL" ){
                            notifications.sendNotification(notizia,req.body.notification);
                        }
                    }else{
                        notifications.promoteNews(notizia.id);
                    }

                    return res.status(200).send({error:false, data:notizia})

                    
                })

            }else{
                return res.send({error:false, data:notizia})
            }
        })
        .catch(function(err){
            console.log(err);
            return res.status(500).send({error:true,message:err.toString()});
        })
    }else{
        return res.status(500).send({error:true,message:"Errore Generale"});
    }
};

