# Entities

The types of entities, a.k.a. objects (e.g. Athlete, Button...) are defined in JSON under `server/assets`.

To add a new asset, add a new JSON file under `server/assets`, then add a reference in `server/routes/admin.js`
and `server/tasks/seed.js`. Now you can run `grunt dropAndSeed` to drop the previous tutorials and assets, and add the
new ones to the database.


## Structure

This is the JSON format for the entities:

```
{
    "name": "Kitten",
    "default_instance_id": "myKitten",
    "description": "A young cat",

    "properties": [

        {
            "name": "whiskerLength",
            "value": "3",
            "comment": "How long kitty's whiskers should be",
            "type": "int",                              // Or float, boolean, string
            "read_only": true                           // If the property is read only, otherwise omit
            "hidden": true                              // If the property is hidden, otherwise omit
        },

        ...

    ],

    "methods": [

        {
            "name": "meow",
            "body": "this.writeText('meow');",
            "comment": "Make a suitable kitten-like noise",
            "read_only": true,                          // If the method is read only, otherwise omit
            "hidden": true                              // If the property is hidden, otherwise omit

        }

        ...

    ],

    "events": [

        {
            "name": "onMeowEnd",
            "listeners": [
                {
                    "entity_id": "myDog",               // Reference another entity instance
                    "method_name": "woof"               // Reference a method on that entity
                }
            ],
            "comment": "When kitty finishes meowing"
        }

        ...

    ]
}
```

## Scenarios

To set up a new 'scenario', i.e. something other than the Long Jump, you would need to create a project containing your
new object assets. It is not yet possible to create a project through the 'My projects' page, so at the moment you will
need to define it as a tutorial. See [Tutorials](05_tutorials.md).


## Known Issues

Currently the initial set of event listeners are defined within the assets themselves. For example, `athlete.json`
actually defines a link from the 'onLongJumpEnd' event, to the mySun.smile method. This shouldn't be part of the assets.
The assets should be 'clean' so they could be used in other kinds of projects, with different entities.

Really, we should have a set of project templates, and tutorials should reference a project template, not just a set of
assets.

