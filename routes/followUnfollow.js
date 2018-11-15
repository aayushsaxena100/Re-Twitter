var router = require('express').Router();
var auth = require('./authenticate');


router.post('/:name/follow', auth.isAuthorized, function(req, res){
	
	var db = req.db;
  	var name = req.params.name;
  	var collection = db.get('Users');
  	if(name===req.session.user.username)
  		return res.status(409).send("Can't follow yourself");          //CANT FOLLOW YOURSELF

  	collection.findOne({username: req.session.user.username},function(err,data){
  		if(err){
  			console.log(err);
  			return res.status(500).send();
  		}
  		
  		for(x in data.followList)	//CHECKS IF ALREADY FOLLOWING THIS USER
  		{
  			if(data.followList[x]==name)
  				return res.status(409).send('Already following');  //ALREADY FOLLOWING
  		}
  		collection.findOne({username: name},function(err,data1){
  			if(err){
  				console.log(err);
  				return res.status(500).send();
  			}
  			// CHECKING IF USER TO FOLLOW EXISTS
  			if(data1===null)	
  				return res.status(404).send('User does not exist');    // USER DOES NOT EXIST

  			//FOLLOW THIS USER
  			collection.update({username: req.session.user.username}, {$push: {followList: name}}, function(err, data2){
		  		if(err){
		  			console.log(err);
		  			return res.status(500).send();
		  		}
		  		collection.update({username: name}, {$push: {followers: req.session.user.username}}, function(err, data3){
              if(err){
                console.log(err);
                return res.status(500).send();
              }
              return res.status(200).send();
          });
		  	});
  		});
  	});
});


router.post('/:name/unfollow', auth.isAuthorized, function(req, res){

	var db = req.db;
  	var name = req.params.name;
  	var collection = db.get('Users');

  	if(name===req.session.user.username)   //CAN'T UNFOLLOW YOURSELF
  		return res.status(409).send();

  	collection.findOne({username: req.session.user.username},function(err,data1){
  		if(err){
  			console.log(err);
  			return res.status(500).send();
  		}
  		var t=0;
  		for(x in data1.followList)	//CHECKS IF ALREADY FOLLOWING THIS USER
  		{
  			if(data1.followList[x]==name)
				t=1;
  		}
  		if(t===1)
  		{
  			collection.update({username: req.session.user.username}, {$pull: {followList: name}}, function(err, data2){
		  		if(err){
		  			console.log(err);
		  			return res.status(500).send();
		  		}
		  		collection.update({username: name}, {$pull: {followers: req.session.user.username}}, function(err, data3){
              if(err){
                console.log(err);
                return res.status(500).send();
              }
              return res.status(200).send();
          });
			});
  		}
  		else
  			return res.status(409).send('Already not following');   //NOT FOLLOWING
	});
 });

module.exports = router;