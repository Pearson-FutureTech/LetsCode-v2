'use strict';

var express = require('express'),
    passport = require('passport'),
    path = require('path'),
    swagger = require('swagger-node-express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    methodOverride = require('method-override');

var config = require('./config'),
    documentationModels = require('./models/docs'),
    projectResources = require('./routes/project'),
    userResources = require('./routes/user'),
    assetResources = require('./routes/asset'),
    tutorialResources = require('./routes/tutorial'),
    adminResources = require('./routes/admin');

var cookieSecret = config.get('LETS_CODE_COOKIE_SECRET'),
    sessionSecret = config.get('LETS_CODE_SESSION_SECRET');

var serverPort = config.get('PORT') || config.get('express:port');

var app = express(),
    rootPath,
    env = process.env.NODE_ENV || 'development';

// CSS files are located in .tmp/styles after being compiled from SASS
if( env === 'development' ) {

    console.log('Running in development');

    rootPath = path.join(__dirname, '../app');

    app.use(express.static(rootPath));
    app.use(express.static(rootPath + '/.tmp'));

    //app.use(express.logger('dev'));

} else if( env === 'staging' ) {

    // All static files for production are built to the dist directory

    console.log('Running in staging');

    rootPath = path.join(__dirname, '../dist');

    app.use(express.static(rootPath));

} else if( env === 'production' ) {

    console.log('Running in production');

    rootPath = path.join(__dirname, '../dist');

    app.use(express.static(rootPath));
}

app.set('base', '/');
app.set('port', serverPort);
app.set('views', rootPath);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser( cookieSecret ));
app.use(cookieSession({
    secret: sessionSecret,
    cookie: {
        maxAge: (30 * 24 * 60 * 60 * 1000)
    }
}));

app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);

// Homepage and Help pages are special - we render them server-side
app.get('/', function(req, res) {
    res.render('index');
});
app.get('/help', function(req, res) {
    res.render('help');
});

// Client-rendered app views
app.get('/tutorials', function(req, res) {
    res.render('app');
});
app.get('/projects', function(req, res) {
    res.render('app');
});
app.get('/profile/*', function(req, res) {
    res.render('app');
});
app.get('/info', function(req, res) {
    res.render('app');
});
app.get('/tutorial/*', function(req, res) {
    res.render('app');
});
app.get('/project/*', function(req, res) {
    res.render('app');
});

app.get('/sign_out', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Setup Swagger
var api = express();
app.use('/api', api);
swagger.setAppHandler(api);
swagger.configureSwaggerPaths('', '/docs', '');

swagger.addModels(documentationModels);

// Project
swagger.addGet(projectResources.getProjectById);
swagger.addPatch(projectResources.updateProjectById);
swagger.addDelete(projectResources.deleteProjectById);
swagger.addPost(projectResources.saveAsProject);
swagger.addPost(projectResources.createProjectFromTutorial);

// User
swagger.addGet(userResources.getUserByUsernameOrMe);
swagger.addPut(userResources.updateUser);
swagger.addPost(userResources.signUp);
swagger.addPost(userResources.signIn);
swagger.addPost(userResources.signOut);
swagger.addPost(userResources.sendUsernameByEmail);

// Assets
swagger.addGet(assetResources.getAssets);

// Tutorials
swagger.addGet(tutorialResources.getTutorials);

// Admin (/api/admin/...)
swagger.addPost(adminResources.dropSeedableCollections);
swagger.addPost(adminResources.seedCollections);

swagger.configure(config.get('swagger:url'), '1.2');

// Errors (404 needs to be defined at the end)

app.use(function(req, res){
    res.status(404).sendfile(rootPath + '/404.html');
});

module.exports = app;
