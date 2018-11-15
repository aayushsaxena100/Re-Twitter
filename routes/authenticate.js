module.exports.isAuthorized  = function(req, res, next) {

    if(!req.session.user)
    {
        res.status(401).send('unauthorized access/session expired');// User session expired
    }
    else
    	next();
}