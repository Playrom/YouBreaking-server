var Promise = require("bluebird");
const haversine = require('haversine')
var notifications = require('./functions/notifications');
var utils = require('./functions/utils');

var User = require('../models/User');
var Token = require('../models/Token');
var News = require('../models/News');
var Like = require('../models/Like');
var Aggiunte = require('../models/Aggiunte');
var LocationUser = require('../models/LocationUser');
var Aggiunte = require('../models/Aggiunte');
var LocationUser = require('../models/LocationUser');
var NotificationToken = require('../models/NotificationToken');

exports.postLike = function(req, res) {

    if(req.user && req.body && req.body.notizia_id){
        var idUtente = req.user.id;
        var body = req.body;

        Like
        .forge({
            user_id : idUtente,
            notizia_id : body.notizia_id
        })
        .save()
        .then(function(like){
            if(like){
                res.status(200).send({error:false,message:"Post Liked",data:like.toJSON()});
            }else{
                res.status(500).send({error:true,message:"Error During Like Creation"});
            }
        });
    }
};

exports.deleteLike = function(req, res) {

    if(req.user && req.body && req.body.notizia_id){
        var idUtente = req.user.id;
        var body = req.body;

        Like
        .forge({
            user_id : idUtente,
            notizia_id : body.notizia_id
        })
        .fetch()
        .then(function(like){
            if(like){
                like.destroy()
                .then(function(deleteLike){
                    res.status(200).send({error:false,message:"Like Deleted",data:like.toJSON()});
                })
                .catch(function(error){
                    res.status(500).send({error:true,message:"Error During Like Deletation","developer":error});
                })

            }else{
                res.status(404).send({error:true,message:"Like Not Found during deletation"});
            }
        });
    }
};
