/* jshint camelcase: false */

'use strict';

var extend = require('util')._extend,
    swagger = require('swagger-node-express');

var ProjectModel = require('../models/project-model'),
    UserModel = require('../models/user-model'),
    TutorialModel = require('../models/tutorial-model');

var assets = {
    scene: require('../assets/scene.json'),
    project: require('../assets/project.json'),
    athlete: require('../assets/athlete.json'),
    sandpit: require('../assets/sandpit.json'),
    scoreboard: require('../assets/scoreboard.json'),
    sun: require('../assets/sun.json')
};


/**
 * Get a specific project
 */
exports.getProjectById = {
    'spec': {
        'description': 'Get a single project',
        'path': '/projects/{projectId}',
        'notes': 'Returns a project based on ID',
        'summary': 'Find project by ID',
        'method': 'GET',
        'params': [swagger.pathParam('projectId', 'ID of project that needs to be fetched', 'string')],
        'responseClass': 'Project',
        'errorResponses': [
            swagger.errors.invalid('projectId'),
            swagger.errors.notFound('project')
        ],
        'nickname': 'getProjectById'
    },
    'action': function (req, res) {
        console.log('Get project', req.params);

        if( !req.params.projectId ) {
            return swagger.errors.invalid('projectId', res);
        }

        ProjectModel.findById(req.params.projectId, function (err, project) {
            if (err) {
                console.log(err);
                return swagger.stopWithError(res);
            }

            if (!project) {
                return swagger.errors.notFound('project', res);
            }

            return res.json({
                message: 'Success',
                project: project
            });
        });

    }
};

/**
 * Update a specific project
 */
exports.updateProjectById = {
    'spec': {
        'description': 'Update a single project by ID',
        'path': '/projects/{projectId}',
        'notes': 'Returns the updated project',
        'summary': 'Update a single project',
        'method': 'PATCH',
        'params': [
            swagger.pathParam('projectId', 'ID of project that needs to be fetched', 'string'),
            swagger.bodyParam('Project', 'Body containing updates')
        ],
        'responseClass': 'Project',
        'errorResponses': [
            swagger.errors.invalid('projectId'),
            swagger.errors.notFound('project')
        ],
        'nickname': 'updateProjectById'
    },
    'action': function (req, res) {
        console.log('Update project', req.params);

        if (!req.isAuthenticated()) {
            return swagger.errors.forbidden(res);
        }

        if (!req.params.projectId) {
            return swagger.errors.invalid('projectId', res);
        }

        ProjectModel.findById(req.params.projectId, function (err, project) {
            if (err) {
                console.log(err);
                return swagger.stopWithError(res);
            }

            if (!project) {
                return swagger.errors.notFound('project', res);
            }

            // Check project is owned by this user
            if( !req.user._id || !req.user._id.equals( project.author_id ) ) {
                console.log('User is not the author of the project:', req.user._id, project.author_id);
                return swagger.errors.forbidden(res);
            }

            var propertiesToUpdate = [
                'name',
                'description',
                'stage',
                'is_featured'
            ];

            propertiesToUpdate.forEach(function (property) {
                if (req.body[property]) {
                    project[property] = req.body[property];
                }
            });


            project.save(function (err, savedProject) {
                if (err) {
                    console.error(err);
                    return swagger.stopWithError(res);
                }

                console.log('Updated project ' + savedProject._id);
                return res.json({
                    message: 'Project updated successfully',
                    project: project
                });

            });


        });

    }
};

/**
 * Delete a specific project
 */
exports.deleteProjectById = {
    'spec': {
        'description': 'Delete a single project by ID',
        'path': '/projects/{projectId}',
        'notes': 'Returns the updated project',
        'summary': 'Delete a single project',
        'method': 'DELETE',
        'params': [
            swagger.pathParam('projectId', 'ID of project that needs to be fetched', 'string'),
        ],
        'responseClass': 'Project',
        'errorResponses': [
            swagger.errors.invalid('projectId'),
            swagger.errors.notFound('project')
        ],
        'nickname': 'updateProjectById'
    },
    'action': function (req, res) {
        console.log('Delete project', req.params);

        var projectId = req.params.projectId;

        if( !req.isAuthenticated() ) {
            return swagger.errors.forbidden(res);
        }

        ProjectModel.findById(projectId, function (err, project) {
            if( err || !project ) {
                console.log(err);
                return swagger.stopWithError(res);
            }

            // Check project is owned by this user
            if( !req.user._id.equals( project.author_id ) ) {
                return swagger.errors.forbidden(res);
            }

            project.remove();

            return res.json(project);

        });
    }
};

/**
 * Save a project
 */
exports.saveAsProject = {
    'spec': {
        'description': 'Save a new project',
        'path': '/projects',
        'notes': 'Returns the new project ID',
        'summary': 'Save a project as a new project',
        'method': 'POST',
        'params': [
            swagger.bodyParam('Project', 'Body containing project')
        ],
        'responseClass': 'String',
        'errorResponses': [
            swagger.errors.notFound('project')
        ],
        'nickname': 'saveAsProject'
    },
    'action': function (req, res) {

        var propertiesToSave,
            projectDefinition = {},
            project,
            username;

        if( req.isAuthenticated() && req.user && req.user.username ) {
            username = req.user.username;
        } else {
            return swagger.errors.forbidden(res);
        }

        UserModel.findOne({username: username}, function(errUser, user) {
            if( errUser ) {
                console.log(errUser);
                return swagger.stopWithError(res);
            }

            if( !user ) {
                return swagger.errors.notFound('user', res);
            }

            propertiesToSave = [
                'name',
                'description',
                'stage',
                'is_featured'
            ];

            projectDefinition.author_id = user;

            propertiesToSave.forEach(function (property) {
                if (req.body[property]) {
                    projectDefinition[property] = req.body[property];
                }
            });

            project = new ProjectModel(projectDefinition);

            project.save(function (err, savedProject) {
                if (err) {
                    console.error(err);
                    return swagger.stopWithError(res);
                }

                console.log('Saved project', savedProject._id);
                return res.json({
                    message: 'Project saved successfully',
                    project: savedProject
                });

            });

        });

    }
};

/**
 * Create a project based on a specific tutorial
 */
exports.createProjectFromTutorial = {
    'spec': {
        'description': 'Set up a tutorial project for the current user',
        'path': '/projects/createProjectFromTutorial',
        'notes': 'Returns a newly created Project',
        'summary': 'Set up a tutorial project for the current user',
        'method': 'POST',
        'params': [swagger.bodyParam('tutorialId', 'ID of tutorial to create project from', 'string')],
        'responseClass': 'Project',
        'errorResponses': [
            swagger.errors.forbidden(),
            swagger.errors.invalid('tutorialId'),
            swagger.errors.notFound('tutorial'),
            swagger.errors.notFound('user')
        ],
        'nickname': 'createProjectFromTutorial'
    },
    'action': function( req, res ) {
        console.log('Create project from tutorial', req.params);

        var username,
            project,
            projectData;

        if( req.isAuthenticated() && req.user && req.user.username ) {
            username = req.user.username;
        } else {
            return swagger.errors.forbidden(res);
        }

        UserModel.findOne({username: username}, function(errUser, user) {
            if( errUser ) {
                console.log(errUser);
                return swagger.stopWithError(res);
            }

            if( !user ) {
                return swagger.errors.notFound('user', res);
            }

            TutorialModel.findById( req.body.tutorialId, function(errTutorial, tutorial) {
                if( errTutorial ) {
                    console.log(errTutorial);
                    return swagger.stopWithError(res);
                }

                if( !tutorial ) {
                    return swagger.errors.notFound('tutorial', res);
                }

                // Clone so we don't affect original object - nb. this is just a shallow clone - seems to be enough?
                projectData = extend({}, assets.project);

                /**
                 * The order of items in the array is currently significant as
                 * it determines the order that they are drawn, which in turn
                 * determines their perceived 'z-index'
                 */
                projectData.stage.entities = [];

                for( var i=0; i < tutorial.entities.length; i++ ) {
                    // TODO verify that this asset exists (will be important when we open up tutorial creation)
                    projectData.stage.entities[i] = extend({}, assets[tutorial.entities[i]]);
                }

                // We set the ID to be the object? Looks like Mongo figures it out...
                projectData.author_id = user;
                projectData.tutorial_id = tutorial;
                projectData.name = 'Project ' + tutorial.level + '-' + tutorial.number + ': ' + tutorial.name;

                project = new ProjectModel(projectData);

                project.save(function(errSaveProject, savedProject) {
                    if (errSaveProject || !savedProject) {
                        console.log(errSaveProject);
                        return swagger.stopWithError(res);
                    }

                    // Save tutorial-project association on the user

                    if( !user.tutorial_project_refs ) {
                        user.tutorial_project_refs = {};
                    }

                    user.tutorial_project_refs[tutorial.level + '-' + tutorial.number] = savedProject._id;

                    // We have to explicitly tell Mongoose we've updated this, otherwise it won't save the change!
                    user.markModified('tutorial_project_refs');

                    user.save(function(errSaveUser, savedUser) {
                        if( errSaveUser || !savedUser ) {
                            console.log( errSaveUser );
                            return swagger.stopWithError(res);
                        }

                        return res.json({
                            message: 'Success',
                            data: savedProject
                        });

                    });

                });
            });
        });

    }
};
