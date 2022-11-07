const fs = require('fs');

module.exports = function(oldPath, name){
    let newPath = __dirname + '/public/assets/img/' + name;
    fs.copyFile(oldPath, newPath, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('Upload successfully!');  
    })
}