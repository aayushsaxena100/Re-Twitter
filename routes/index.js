var express = require('express');
var router = express.Router();
var followUnfollow = require('./followUnfollow');
var tweet = require('./tweet');
var loginLogoutSignup = require('./loginLogoutSignup');

/* GET home page. */
router.get('/', function(req, res) {
  res.status(200).send("Hello");
});


//SIGNUP

router.use('/signup', loginLogoutSignup);


//LOGIN

router.use('/login', loginLogoutSignup);


//FOLLOW A USER

router.use('/:name/follow', followUnfollow);


//UNFOLLOW A USER

router.use('/:name/unfollow', followUnfollow);


//CREATE A NEW TWEET

router.use('/newTweet', tweet);


//READ TWEETS

router.use('/:name/tweets', tweet);


//DELETE A TWEET

router.use('/delete/:tweet_id', tweet);


//LOGOUT FROM CURRENT SESSION

router.use('/logout',loginLogoutSignup);

module.exports = router;