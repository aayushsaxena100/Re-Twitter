process.env.NODE_ENV = "test";

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var request = require('supertest');

chai.use(chaiHttp);

var authenticatedUser = request.agent(server);	//TO SAVE AUTHENTICATED USER


describe('SIGNUP TEST', function(){
    
    it('should return status 201 on successful SIGNUP', function(done){
        chai.request(server).post('/signup').set('content-type', 'application/x-www-form-urlencoded')
        .send({'username': 'hello', 'password': 'world'}).end(function(err, res){
            res.should.have.status(201);
            done();
        });
    });

    it('should return 411 status on signing up in with null username and password',function(done){
        chai.request(server).post('/signup').set('content-type', 'application/x-www-form-urlencoded')
        .send({'username': '', 'password': ''}).end(function(err, res){
            if(err)
                done(err);
            else
            {   
                res.should.have.status(411);
                done();
            }
        });
    });


    //make sure the test database has a user with username 'hello' in it.
    it('should return status 409 on signing up with a username that already exists', function(done){
        chai.request(server).post('/signup').set('content-type', 'application/x-www-form-urlencoded')
        .send({'username': 'hello', 'password': 'world'}).end(function(err, res){
            res.should.have.status(409);
            done();
        });
    });
});



describe('LOGIN TEST', function(){

    it('should return 200 status on successful login',function(done){
        authenticatedUser.post('/login').set('content-type', 'application/x-www-form-urlencoded')
        .send({'username': 'hello', 'password': 'world'}).end(function(err, res){
            if(err)
                done(err);
            else
            {   
                res.should.have.status(200);
                done();
            }
        });
    });

    it('should return 411 status on logging in with null username and password',function(done){
        chai.request(server).post('/login').set('content-type', 'application/x-www-form-urlencoded')
        .send({'username': '', 'password': ''}).end(function(err, res){
            if(err)
                done(err);
            else
            {   
                res.should.have.status(411);
                done();
            }
        });
    });


    it('should return 401 status on logging in with incorrect credentials',function(done){
        chai.request(server).post('/login').set('content-type', 'application/x-www-form-urlencoded')
        .send({'username': 'foo', 'password': 'bar'}).end(function(err, res){
            if(err)
                done(err);
            else
            {   
                res.should.have.status(401);
                done();
            }
        });
    });
});




describe('READ TWEET TEST', function(){
    
    it('should return 200 status on getting all the tweets of the requested user', function(done){
        authenticatedUser.post('/hello/tweets').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            }
        });
    });

    it('should return 404 status for requests asking for tweets of unregistered user', function(done){
        authenticatedUser.post('/foo/tweets').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(404);
                done();
            }
        });
    });
});


describe('CREATE NEW TWEET TEST', function(){

    it('should return 201 status on successful tweet creation',function(done){
        authenticatedUser.post('/newTweet')
        .send({'content': 'test tweet','author': 'hello','likes': [""],'likes_count': 0, 'time':new Date(Date.now())})
        .end(function(err, res){
            if(err)
                done(err);
            else
            {   
                res.should.have.status(201);
                done();
            }
        });
    });


    it('should return 400 status when undefined or empty tweet is input',function(done){
        authenticatedUser.post('/newTweet')
        .send({'content': '','author': 'hello','likes': [""],'likes_count': 0, 'time':new Date(Date.now())})
        .end(function(err, res){
            if(err)
                done(err);
            else
            {   
                res.should.have.status(400);
                done();
            }
        });
    });
});


describe('DELETE TWEET TEST', function(){

    it('should return 204 status on successful tweet deletion',function(done){

        authenticatedUser.del('/delete/5bd5bf633010bb287474910d')   // ID SHOULD BE A STRING OF 12 BYTES
        .end(function(err, res){                                    // OR STRING OF 24 HEX CHARACTERS
            if(err)
                done(err);
            else
            {   
                res.should.have.status(204);
                done();
            }
        });
    });


    it('should return 404 status on trying to delete a tweet with ID that does not exist',function(done){

        authenticatedUser.del('/delete/5bd428aae9da8a58ac695937') // ID SHOULD BE A STRING OF 12 BYTES
        .end(function(err, res){                                  // OR STRING OF 24 HEX CHARACTERS
            if(err)
                done(err);
            else
            {   
                res.should.have.status(404);
                done();
            }
        });
    });
});



describe('FOLLOW USER TEST', function(){
    
    it('should return 200 status on successfully following user', function(done){
        authenticatedUser.post('/code/follow').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(200);
                done();
            }
        });
    });

    it('should return 404 status for requests following unregistered user', function(done){
        authenticatedUser.post('/foo/follow').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(404);
                done();
            }
        });
    });

    it('should return 409 status for requests following yourself', function(done){
        authenticatedUser.post('/hello/follow').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(409);
                done();
            }
        });
    });

    it('should return 409 status for requests to follow already following user', function(done){
        authenticatedUser.post('/code/follow').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(409);
                done();
            }
        });
    });
});


describe('UNFOLLOW USER TEST', function(){
    
    it('should return 200 status on successfully unfollowing user', function(done){
        authenticatedUser.post('/code/unfollow').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(200);
                done();
            }
        });
    });

    it('should return 409 status for requests unfollowing unregistered user', function(done){
        authenticatedUser.post('/foo/unfollow').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(409);
                done();
            }
        });
    });

    it('should return 409 status for requests unfollowing yourself', function(done){
        authenticatedUser.post('/hello/unfollow').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(409);
                done();
            }
        });
    });

    it('should return 409 status for requests to follow already not following the user', function(done){
        authenticatedUser.post('/code/unfollow').end(function(err, res){
            if(err)
                done(err);
            else
            {
                res.should.have.status(409);
                done();
            }
        });
    });
});


describe('LOGOUT TEST', function(){

    it('should return 200 status on successful logout',function(done){
        chai.request(server).get('/logout').end(function(err, res){
            if(err)
                done(err);
            else
            {   
                res.should.have.status(200);
                done();
            }
        });
    });
});