'use strict';

module.exports = {

    'Project': {
        'id': 'Project',

        'properties': {
            '_id': {
                'type': 'string',
                'description': 'Project ID'
            },

            'author_id': {
                'type': 'string',
                'description': 'ID of authoring user'
            },

            'name': {
                'type': 'string',
                'description': 'Unique project name'
            },

            'description': {
                'type': 'string',
                'description': 'Optional project description'
            },

            'stage': {
                'type': 'string',
                'description': 'Optional project description'
            },

            'created_at': {
                'type': 'string',
                'description': 'Project creation date'
            },

            'updated_at': {
                'type': 'string',
                'description': 'Project updated date'
            }
        }
    },


    'User': {
        'id': 'User',

        'properties': {
            '_id': {
                'type': 'string',
                'description': 'Project ID'
            },

            'username': {
                'type': 'string',
                'description': 'Username'
            },

            'projects':{
                'type':'array',
                'items':{
                    '$ref':'Project'
                },
                'description':'Projects the user has created'
            }

        }
    },


    'LogInResponse': {
        'id': 'LogInResponse',

        'properties': {
            'username': {
                'type': 'string',
                'description': 'Username'
            },

            'projectId': {
                'type': 'integer',
                'description': 'Users project ID'
            }
        }
    },


    'Asset': {
        'id': 'Asset',

        'properties': {
            'name': {
                'type': 'string',
                'description': 'Name'
            },

            'description': {
                'type': 'string',
                'description': 'Description of asset'
            },

            'property_set': {
                'type': 'object',
                'description': 'Asset properties'
            },

            'method_set': {
                'type': 'object',
                'description': 'Asset methods'
            },

            'event_set': {
                'type': 'array',
                'description': 'Array of asset events'
            },

            'created_at': {
                'type': 'string',
                'description': 'Asset creation date'
            },

            'updated_at': {
                'type': 'string',
                'description': 'Asset updated date'
            }
        }
    },


    'Tutorial': {
        'id': 'Tutorial',

        'properties': {

            'name': {
                'type': 'string',
                'description': 'Title of tutorial'
            },

            'description': {
                'type': 'string',
                'description': 'Description of tutorial'
            },

            'steps': {
                'type': 'array',
                'description': 'Tutorial step definitions'
            },

            'created_at': {
                'type': 'string',
                'description': 'Asset creation date'
            },

            'updated_at': {
                'type': 'string',
                'description': 'Asset updated date'
            }

        }
    }

};
