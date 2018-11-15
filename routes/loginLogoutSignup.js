var router = require('express').Router();
var auth = require('./authenticate');

router.get('/signup', function(req, res){
  res.status(405).send('Use POST');
});

router.post('/signup',function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var username = req.body.username;
    var password = req.body.password;

    if(username=="" || password=="")    //Username or password is missing
      return res.status(411).send();    

    // Set our collection
    var collection = db.get('Users');


    collection.findOne({username: username}, function(err, user){
    if(err){
      console.log(err);
      return res.status(500).send();
    }
    if(!user){
	      collection.insert({
	        "username" : username,
	        "password" : password,
	        "followList" : [],
          "followers" :[]
	    }, function (err, doc) {
	        if (err) {
	            // If it failed, return error
	            return res.status(500).send("Database Error");
	        }
	        else {
	            //success 
	            return res.status(201).send('Success');
	        }
	    });
    }
    else{
    	//Signing up with a username that already exists
    	return res.status(409).send('Username already exists'); //conflict status code
    }
  });
});

router.get('/login', function(req, res){
  res.status(405).send('Use POST');
});

router.post('/login', function(req, res) {
  var db = req.db;

  // Get our form values. These rely on the "name" attributes in the form
  var username = req.body.username;
  var password = req.body.password;

  if(username=="" || password=="")    //Username or password is missing
      return res.status(411).send();    

  var collection = db.get('Users');

  collection.findOne({username: username, password: password}, function(err, user){
    if(err){
      console.log(err);
      return res.status(500).send();
    }
    if(!user){
      return res.status(401).send('Incorrect Credentials');
    }
    req.session.user = user;

    collection.find({username: {$nin: user.followList ,$ne: user.username}}, function(err, names){
    	if(err){
      	  console.log(err);
      	  return res.status(500).send();
    	}
    	
	    return res.status(200).send('Welcome '+user.username);
    });
  });
});


router.get('/logout', function(req,res){
  req.session.destroy();
  res.status(200).send('Logged Out Successfully');
});

module.exports = router;