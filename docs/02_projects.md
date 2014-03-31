# Projects

A project is created for users whenever they undertake a tutorial. They can also 'Save As' to duplicate a project.


## Structure

Each project stored in MongoDB as a bunch of JSON.


### Project

**_id** `ObjectId` a unique project identifier

**__v** `Number` an internal revision of the document

**author_id** `ObjectId` reference to the author of the project

**tutorial_id** `ObjectId` reference to the tutorial this project was created for, if applicable

**name** `String` a name for the project

**description** `String` optional description of the project

**stage** `Mixed` stage JSON object, including all the objects on the stage

**created_at** `Date` project creation date

**updated_at** `Date` last modification date

**is_featured** `Boolean` not currently used (in the future, could be used for a Featured Projects list)

```
{
    "_id" : ObjectId("52319153808aa51d1b000001"),
	"__v" : 0
    "author_id": ObjectId("52319153808aa51d1b000002"),
    "tutorial_id": ObjectId("52319153808aa51d1b000003"),
    "name": "Sample name of the project",
    "description": "Sample description text",
    "stage": {},
    "created_at": "2013-09-18T09:26:28.842Z",
    "updated_at": "2013-09-18T09:26:29.842Z",
    "is_featured": ""
}
```


### Stage

Each project must have one and only one stage, which is another JSON object.

**width** `Number`

**height** `Number`

**background** `String`

**entity_set** `Array`

**is_active** `Boolean`


### Entities

On stage there could be multiple entities, each defined by:

**name** `String`

**description** `String`

**properties** `Mixed`

**methods** `Array`

**events** `Array`

```
{
    "name": "Entity title",
    "description": "Entity explained",
    "properties": [
        ...
    ],
    "methods": [
        ...
    ],
    "events": [
        ...
    ]
}
```

See [Entities](03_entities.md) for more information on entities and their structure.


## Known Limitations

The idea is that projects should be able to be created from scratch, or from basic templates (e.g. a Long Jump project).
But right now, projects can only be created via tutorials.
