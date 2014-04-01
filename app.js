var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var passport = require('passport')
,   TwitterStrategy = require('passport-twitter').Strategy;
var app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use( new TwitterStrategy({
    consumerKey: process.env.ELI_KEY,
    consumerSecret: process.env.ELI_SECRET,
    callbackURL: "http://"+process.env.ELI_CALLBACK+"/auth/twitter/callback"
  },
  function( atoken, atokenSecret, profile, done ){
    token = atoken;
    tokenSecret = atokenSecret;
    process.nextTick(function(){
      return done(null, profile);
    })
  }
));

// all environments
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index );
app.get('/auth/twitter', passport.authenticate('twitter'), function(req, res){ });
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  failureRedirect: '/' }),
  function(req, res) {
  req.session.token = token;
  req.session.tokenSecret = tokenSecret;
  res.redirect('/');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
