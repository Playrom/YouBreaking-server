var fs = require('fs');
var path = require('path');
var sharp = require('sharp');

var User = require('./models/User');
var Token = require('./models/Token');
var News = require('./models/News');
var Voto = require('./models/Voto');
var Aggiunte = require('./models/Aggiunte');
var LocationUser = require('./models/LocationUser');
var NotificationToken = require('./models/NotificationToken');


var dirPath = path.join(__dirname, '/public/photos/')

function removeDirForce(directory) {
    fs.readdir(directory, function(err, files) {
        if (err) {
            console.log(err.toString());
        }else {
            files.map(function(file){
                var filePath = directory + file;
                var fileType = path.extname(file);
                var imageName = path.basename(file,fileType);
                
                fs.stat(filePath, function(err, stats) {
                    if (stats.isFile()) {
                        if(file.includes('small') || file.includes('medium') || file.includes('large') || file.includes('thumb')){
                            fs.unlink(filePath, function(err) {
                                if (err) {
                                    console.log(err.toString());
                                }
                            });
                        }
                    }
                });

                generateImages(directory,imageName,fileType);

            });
        }
    });
}

removeDirForce(dirPath);


function generateImages(path,imageName,imageType){
    var small = imageName + "-small" + '.' + 'jpeg';
    var medium = imageName + "-medium" + '.' + 'jpeg';
    var large = imageName + "-large" + '.' + 'jpeg';
    var thumb = imageName + "-thumb" + '.' + 'jpeg';

    var originalPath = path + imageName  +  imageType;
    var smallPath = path + small;
    var mediumPath = path + medium;
    var largePath = path + large;
    var thumbPath = path + thumb;

    photoPath =  imageName + '.' + imageType;

    // Save decoded binary image to disk
    try{
        var buffer = fs.readFileSync(originalPath)

        sharp(buffer)
        .resize(300)
        .jpeg({quality:100})
        .toFile(smallPath, function(err) {});

        sharp(buffer)
        .resize(600)
        .jpeg({quality:100})
        .toFile(mediumPath, function(err) {});
        
        sharp(buffer)
        .resize(1200)
        .jpeg({quality:100})
        .toFile(largePath, function(err) {console.log(err);});

        sharp(buffer)
        .resize(1200,400)
        .jpeg({quality:100})
        .crop()
        .toFile(thumbPath, function(err) {});
    }catch(error) {
        console.log('ERROR:', error);
    }

}