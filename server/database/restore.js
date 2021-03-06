var restore = Npm.require('mongodb-restore');
var fs = Npm.require('fs');

WebApp.connectHandlers.use('/database/restore',function(req,res,next){
  if(req.method ==='POST'){
    let file = fs.createWriteStream('./dump.tar');
    file.on('error',function(error){
      console.log('errr: ' + error);
    });
    file.on('finish',Meteor.bindEnvironment(function(){
      res.writeHead(204);
      res.end(); //end the respone
      restore({
        uri: process.env.MONGO_URL || 'mongodb://localhost:3001/meteor',
        root:'./',
        tar:'dump.tar',
        drop:true,
        callback:Meteor.bindEnvironment(function(err){
          fs.unlink('./dump.tar',Meteor.bindEnvironment(function (err){
            if (err) throw err;
          }));
        })
      })
    }));
    req.pipe(file); //pipe the request to the file
  }
})
