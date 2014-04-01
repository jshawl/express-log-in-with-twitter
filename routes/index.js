var fs = require('fs');

exports.index = function ( req, res ) {
    var posts;
    if (req.isAuthenticated()){
	  res.render('logged-in', { name: req.user.displayName });
	} else {
	  res.render('index');
	}
    }
