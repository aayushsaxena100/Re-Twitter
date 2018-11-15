# Re-Twitter
Basic twitter functionalities using Node.js, Express, MongoDB with some testing using Node's Chai module.

            -------------HOW TO RUN THE API-------------

INCLUDED WITH CODE IS DB FOLDER THAT CONSTAINS THE DEV DATABASE COLLECTIONS JSON FILES ON WHICH THE CODE RUNS BEST (USEFUL IN CASE OF DB IMPORT FOR LOCALHOST USE)

MAKE SURE NODE IS INSTALLED

1. open terminal/cmd and cd to this directory.
2. run the command "npm start".
3. open POSTMAN.
4. if using localhost mongoDB server, start it and make connection changes in app.js
5. by default, the database that is used is hosted on mLAB.


							-------------FUNCTIONALITIES-------------

SIGNUP

*	Send a POST request as --> localhost:3000/signup and set key-value pair in BODY section with
	x-www-form-urlencoded. 

		Example- username: abcd, password: abcd

	ON SUCCESS: status code = 201
	ON EMPTY USERNAME OR PASSWORD: status code = 411
	ON SIGNING UP WITH USERNAME THAT ALREADY EXISTS: status code = 409


LOGIN

*	Send a POST request as --> localhost:3000/login and set key-value pair in BODY section with
	x-www-form-urlencoded. 

		Example- username: abcd, password: abcd

	ON SUCCESS: status code = 200
	ON EMPTY USERNAME OR PASSWORD: status code = 411
	ON INCORRECT CREDENTIALS: status code = 401

LOGOUT

*	Send a GET request as --> localhost:3000/logout



FOLLOW

*	Send a POST request as --> localhost:3000/<usernameToFollow>/follow (ONE NEEDS TO BE LOGGED IN) 
		
	ON SUCCESS: status code = 200
	ON ATTEMPT TO FOLLOW YOURSELF: status code = 409
	ON ATTEMPT TO FOLLOW ALREADY FOLLOWING USER: status code = 409
	ON ATTEMPT TO FOLLOW NON EXISTING USER : status code = 404

UNFOLLOW

*	Send a POST request as --> localhost:3000/<usernameToUnfollow>/unfollow (ONE NEEDS TO BE LOGGED IN) 
		
	ON SUCCESS: status code = 200
	ON ATTEMPT TO UNFOLLOW YOURSELF: status code = 409
	ON ATTEMPT TO UNFOLLOW ALREADY NOT FOLLOWING USER: status code = 409

CREATE TWEET

*	Send a POST request as --> localhost:3000/newTweet and set key-value pair in BODY section with
	x-www-form-urlencoded. 

		Example- content: My first tweet				(ONE NEEDS TO BE LOGGED IN) 
		
	ON SUCCESS: status code = 201
	ON ATTEMPT TO TWEET EMPTY OR UNDEFINED CONTENT: status code = 400

READ TWEET

*	Send a POST request as -> localhost:3000/<username-of-user-whose-tweets-are-to-be-read>/tweets and set key-value pair in BODY section with x-www-form-urlencoded. 

		Example- type: "tweet"/"retweet" (acts as a filter)
		if('type' field is left empty, it displays all tweets and retweets of specified user)		
		(ONE NEEDS TO BE LOGGED IN) 
		
	ON SUCCESS: status code = 201
	ON ATTEMPT TO READ TWEET OF UNREGISTERED USER: status code = 404

DELETE TWEET

*	Send a DELETE request as --> localhost:3000/delete/<_id-of-to-be-deleted-tweet>
		
		(_id should be a valid 12 bytes string or should be 24 hex characters)

		(ONE NEEDS TO BE LOGGED IN & CAN DELETE ONLY IT'S OWN TWEETS) 
		
	ON SUCCESS: status code = 204
	ON ATTEMPT TO DELETE NON EXISTING TWEET: status code = 404
	ON ATTEMPT TO DELETE SOME OTHER USER'S TWEET: status code 401

UNIT AND INTEGRATION TESTING

		----HOW TO----

	* Being in this directory, run this command: "npm test test/test.js"

	This works on test database and not on development database

	Since I have given hard-coded test inputs, there may be some tests that fail.
	That is due to :

		a) _id are generated and can't be known beforehand (DELETE TWEET TEST)
		b) I have emptied the test database, so if the test is run first time, "signup's" 1st test(200 OK)
		   will pass, but on running the test second time, it will fail as that username already exists.
		   (SIGNUP TEST)



LIKE A TWEET

*	Send a POST request as --> localhost:3000/like/<_id-of-tweet-to-be-liked>

		(_id should be a valid 12 bytes string or should be 24 hex characters)

		(ONE NEEDS TO BE LOGGED IN) 
		
		(I have kept the no. of likes of a given tweet as well as list of users who have liked it)

	ON SUCCESS: status code = 200
	ON ATTEMPT TO LIKE NON EXISTING TWEET: status code = 404
	ON ATTEMPT TO LIKE ALREADY LIKED TWEET: status code 409

UNLIKE A TWEET

*	Send a POST request as --> localhost:3000/unlike/<_id-of-tweet-to-be-unliked>

		(_id should be a valid 12 bytes string or should be 24 hex characters)

		(ONE NEEDS TO BE LOGGED IN) 
		
		(I have assumed that unliking is not downvoting. It can only be done if a user has previously liked a tweet and now wants to unlike it.)

	ON SUCCESS: status code = 200
	ON ATTEMPT TO UNLIKE NON EXISTING TWEET: status code = 404
	ON ATTEMPT TO UNLIKE ALREADY UNLIKED TWEET: status code 409

RETWEET A TWEET

*	Send a POST request as --> localhost:3000/retweet/<_id-of-tweet-to-be-retweeted>

		(_id should be a valid 12 bytes string or should be 24 hex characters)

		(ONE NEEDS TO BE LOGGED IN)

		(Every retweet has a parent tweet and a retweeter i.e the user who retweeted, but has its own likes)

	ON SUCCESS: status code = 200
ON ATTEMPT TO RETWEET NON EXISTING TWEET: status code = 404
