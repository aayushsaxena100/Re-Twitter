var router = require('express').Router();
var auth = require('./authenticate');

//CREATE NEW TWEET

router.post('/newTweet', auth.isAuthorized, function(req, res){

	var db = req.db;
	var content = req.body.content;

  if(content=='undefined' || content=='')       //EMPTY OR UNDEFINED TWEET CONTENT
    return res.status(400).send();

	var collection = db.get('Tweets');
	collection.insert({content: content,author: req.session.user.username, type: 'tweet', likes: [],likes_count: 0, time:new Date(Date.now())}, function(err,data){
		if(err){
			console.log(err);
			return res.status(500).send('There was some error in tweeting.');
		}
		return res.status(201).send(data);
	});
});

//READ TWEET

router.post('/:name/tweets', auth.isAuthorized, function(req, res){

	var db = req.db;
  	var name = req.params.name;
  	var type = req.body.type;

  	var collection2 = db.get('Tweets');
  	var collection1 = db.get('Users');
  	collection1.findOne({username: name}, function(err, data1){

  		if(err){
  			console.log(err);
  			return res.status(500).send('There was some error retreiving the tweets');
  		}
  		if(!data1)
  			return res.status(404).send();		// USER NOT REGISTERED

  		if(type=='tweet')
  		{
  			collection2.find({type: type, author: name}, function(err, data2){

		  		if(err){
		  			console.log(err);
		  			return res.status(500).send();
		  		}
		  		return res.status(200).send(data2);	// RETURNING ALL TWEETS BY THIS USER IN JSON
	  		});
  		}
  		else if(type=='retweet')
  		{
  			collection2.find({type: type, user: name}, function(err, data2){

		  		if(err){
		  			console.log(err);
		  			return res.status(500).send();
		  		}
		  		return res.status(200).send(data2);	// RETURNING ALL RETWEETS BY THIS USER IN JSON
	  		});
  		}
  		else
  		{
  			collection2.find({$or:[{author: name},{user: name}]}, function(err, data2){

		  		if(err){
		  			console.log(err);
		  			return res.status(500).send();
		  		}
		  		return res.status(200).send(data2);	// RETURNING ALL TWEETS AND RETWEETS BY THIS USER IN JSON
	  		});
  		}
  	});
});

//DELETE TWEET

router.delete('/delete/:id', auth.isAuthorized, function(req, res){

	  var db = req.db;
  	var id = req.params.id;
  	var collection = db.get('Tweets');

  	collection.findOne({_id: id}, function(err, data){
  		if(err){
  			console.log(err);
  			res.status(500).send();
  		}
      
      	if(data===null)                                // TWEET WITH THIS ID DOES NOT EXIST
        	return res.status(404).send();

  		if(data.author != req.session.user.username)			// USER CAN ONLY DELETE ITS OWN TWEETS
  			return res.status(401).send();

  		collection.findOneAndDelete({_id: id}, function(err, data1){
  			if(err){
	  			console.log(err);
	  			res.status(500).send();
  			}
  			if(data1)
  				return res.status(204).send();
  		});
  	});
});


//LIKE A TWEET


router.post('/like/:id', auth.isAuthorized, function(req, res){

	var db = req.db;
  	var id = req.params.id;
  	var collection = db.get('Tweets');

  	collection.findOne({_id: id}, function(err, data){
  		if(err){
  			console.log(err);
  			res.status(500).send();
  		}
      
	    if(data===null)                                // TWEET WITH THIS ID DOES NOT EXIST
	      return res.status(404).send();

	  	collection.findOne({_id: id},function(err,data1){
	  		if(err){
	  			console.log(err);
	  			return res.status(500).send();
	  		}
	  		var t=0;
	  		for(x in data1.likes)	//CHECKS IF ALREADY LIKED THIS TWEET
	  		{
	  			if(data1.likes[x]==req.session.user.username)
					t=1;
	  		}
	  		if(t!=1)				//HAVE NOT LIKED ALREADY
	  		{
	  			collection.update({_id: id} , {$inc:{"likes_count":1}}, function(err, data1){
					if(err){
						console.log(err);
						return res.status(500).send();
					}
					if(data1)
					{
						collection.update({_id: id} , {$push:{"likes": req.session.user.username}}, function(err, data2){
							if(err){
								console.log(err);
								return	res.status(500).send();
							}

							collection.findOne({_id: id}, function(err, data3){
								if(err){
									console.log(err);
									return	res.status(500).send();
								}
								return res.status(200).send(data3);
							});
						});
					}
				});
	  		}
	  		else
	  			return res.status(409).send();   //LIKED ALREADY
  		});
	});
});


//UNLIKE A TWEET


router.post('/unlike/:id', auth.isAuthorized, function(req, res){

	var db = req.db;
  	var id = req.params.id;
  	var collection = db.get('Tweets');

  	collection.findOne({_id: id}, function(err, data){
  		if(err){
  			console.log(err);
  			res.status(500).send();
  		}
      
	    if(data===null)                                // TWEET WITH THIS ID DOES NOT EXIST
	      return res.status(404).send();

	  	collection.findOne({_id: id},function(err,data1){
	  		if(err){
	  			console.log(err);
	  			return res.status(500).send();
	  		}
	  		var t=0;
	  		for(x in data1.likes)	//CHECKS IF ALREADY LIKED THIS TWEET
	  		{
	  			if(data1.likes[x]==req.session.user.username)
					t=1;
	  		}
	  		if(t===1)				//HAVE LIKED ALREADY, SO UNLIKE IT
	  		{
	  			collection.update({_id: id} , {$inc:{"likes_count":-1}}, function(err, data1){
					if(err){
						console.log(err);
						return res.status(500).send();
					}
					if(data1)
					{
						collection.update({_id: id} , {$pull:{"likes": req.session.user.username}}, function(err, data2){
							if(err){
								console.log(err);
								return	res.status(500).send();
							}

							collection.findOne({_id: id}, function(err, data3){
								if(err){
									console.log(err);
									return	res.status(500).send();
								}
								return res.status(200).send(data3);
							});
						});
					}
				});
	  		}
	  		else
	  			return res.status(409).send();   //HAVE NOT LIKED, SO CAN'T UNLIKE
  		});
	});
 });


//RETWEET A TWEET

router.post('/retweet/:id', auth.isAuthorized, function(req, res){

	var db = req.db;
	var id = req.params.id;
	var collection = db.get('Tweets');
	collection.findOne({_id: id}, function(err, data){
		if(err){
			console.log(err);
			return res.status(500).send('There was some error in retweeting.');
		}
		var parent;
		if(data)
		{
			collection.insert({user: req.session.user.username, type: 'retweet', parent: data._id, likes: [],likes_count: 0, time:new Date(Date.now())}, function(err,data){
				if(err){
					console.log(err);
					return res.status(500).send('There was some error in tweeting.');
				}
				return res.status(201).send(data);
			});
		}
		else
			return res.status(404).send('No tweet with given id');
	});
});


module.exports = router;