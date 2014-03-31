# Tutorial Creation

The tutorials are defined in `server/tutorials`. At this point in time, we have only defined the first three.


## Structure

This is the JSON format for tutorials:

```
{
	"level": 1,                 // The tutorial level (we only have one level so far)
	"number": 2,                // Which number the tutorial is
	"name": "My tutorial name",
	"description": "My description for the tutorial",
	"entities": [               // The set of assets to include in the project for this tutorial
	    ...
	],
	"steps": [                  // Definitions of each tutorial step (see below)
	    ...
	]
}
```

Then the individual tutorial steps are in this format:

```
{
    "contents": "<p>Bla bla bla HTML.</p>",  // The HTML contents of the tutorial popup bubble
    "stepClasses": [                         // Specific CSS classes to give this step element
        "myStepClassForCSS"
    ],
    "highlight": {
        "stage": "ObjectName"                // Or "dom": ".my-selector"
    },
    "enableInput": {
        "dom": ".my-selector",               // Element(s) to enable for user interaction (actionToProceed.element is enabled by default)
                                             // Or "stage": "ObjectName"
    },
    "initActions": {                         // Actions to perform automatically at the start of this step
        "showEditTab": "#panel-properties",  // For steps when you need to be on a certain tab
        "setMode": "edit",                   // For steps when you need to auto change to edit/play mode
        "clearEvents": [ ... ]               // When you need to remove events set up for demo at beginning
    },
    "actionToProceed": {                     // If this doesn't exist, Continue button is shown
        "object": "ObjectName"               // Or "element": ".my-selector"
        "type": "update",                    // "select", "update" or "change"
        "property": "myProp"                 // Optional specific property, for "update"
    },
    "nextStepDelay": 1000                    // Wait these milliseconds before showing next step (don't normally need)
}
```


## Adding or Editing Tutorials

To see your changes, add any new tutorial filenames to the list in `server/tasks/seed.js` and `server/routes/admin.js`.
Then run `grunt dropAndSeed`, and re-run the app with `grunt`.


## Known Issues

As described in [Entities](03_entities.md), the tutorials should reference a project template, not a set of entities.
