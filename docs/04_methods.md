# Methods

Methods are the pieces of code that make things happen on the stage. They are triggered in one of three ways:
 - By the onStart scene event.
 - By an on*MethodName*End event. These are fired automatically at the end of methods.
 - From within a method, using `this.trigger('methodName')`.

The methods are defined inside each asset in `server/assets`. In the world of the source code, they are not *actual*
methods; they are strings of code defined in JSON.

The method code is eval'ed, which, as most JavaScript developers will be aware, is something you have to be very
careful with, for security reasons. So, while the idea is that the methods should be editable within the app (in the
code view under the Methods tab), it would take more work to ensure this is safe, so right now they can only be edited
through the actual source code. (We'd love to hear any thoughts or advice about this).

Animations are based on [EaselJS](http://www.createjs.com/#!/EaselJS).


## Method code aims

- The code that the user writes needs to be as easy to understand as possible.
- The code that the user writes must be javascript, not pseudo-code.
- The user will for the most part be coding visually moving parts, or 'animations'.
- The user needs to be able to mix and match animations in a creative way


## Example method code

*Example 1: Run the 'run' sprite animation, while moving the object to the right 200 pixels, with a duration of 2 secs*

```javascript
this.animate('run');
this.move({x: 200 y: 0}).duration(2);
```

*Example 2: Run the 'longjump' sprite animation, while moving the object in a parabola (100 across, 100 up), in 1 sec*

```javascript
this.animate('longjump');
this.parabola({x: 100, y: 100}).duration(1);
```


### Accessing properties

Within each entity method the author can get the properties of the current entity through `this.properties`, e.g.

```javascript
this.move({x: this.properties.runDistance, y: 0})
```

The properties of the 'calling' object can also be accessed - see [Events and calling objects](#events-calling-objects).

NB. Changes to object properties made within methods will not be synced back to the project, they will just persist
while the project is being 'played'.


### <a name="events-calling-objects"></a>Events and calling objects

If a connection is set up from an event on one object to a method on another (e.g. myAthlete.onLongJumpEnd triggers
myScoreboard.update), then the triggered method has access to the source entity via 'caller'.

For example, myScoreboard.update can read the athlete's left and top properties:

```javascript
var athleteX = caller.left;
```


## Available commands

[animate](#animate)
[delay](#delay)
[duration](#duration)
[move](#move)
[moveOnPath](#moveOnPath)
[parabola](#parabola)


### animate

```javascript
this.animate(animationName)
```

`animationName` is a String with the name of a Sprite animation to play. These Sprite animations are predefined on an
entity's hidden `sprite` property. Depending upon this definition some of them will run once and others will loop
indefinitely once activated.


### delay

```javascript
this.move(options).delay(delayInSeconds);

// or

this.move(options);
this.delay(delayInSeconds);
```

`delayInSeconds` is a length in seconds to wait before starting the `move()` animation.

Can be combined with delay:

```javascript
this.move(options).delay(delayInSeconds).duration(durationInSeconds);

// or

this.move(options);
this.delay(delayInSeconds);
this.duration(durationInSeconds);
```

If you call this method without having called move(), it will error with:

`You need to have called move() before setting a delay`


### duration

```javascript
this.move(options).duration(durationInSeconds);

// or

this.move(options);
this.duration(durationInSeconds);
```

`durationInSeconds` is the length in seconds of the `move()` animation. Defaults to 0 seconds (instantaneous).

Can be combined with delay:

```javascript
this.move(options).duration(durationInSeconds).delay(delayInSeconds);

// or

this.move(options);
this.duration(durationInSeconds);
this.delay(delayInSeconds);
```

If you call this method without having called move(), it will error with:

`You need to have called move() before specifying a duration`


### move

```javascript
this.move(options);
```

`options` is an object with the following properties:

- `x` The distance in pixels to move along the x-axis, relative to the current position (optional if `y` is specified)
- `y` The distance in pixels to move along the y-axis, relative to the current position (optional if `x` is specified)

This method can be chained with the following methods:

- [accelerate](#accelerate)
- [delay](#delay)
- [duration](#duration)

If `x` and `y` are not defined, it will error with:

`You need to call move with an object that has at least an 'x' or 'y' property'`


### moveOnPath

```javascript
this.moveOnPath(options);
```

`options` is an *array* of objects with the following properties:

- `x` The distance in pixels along the x-axis, relative to the last position in the path
- `y` The distance in pixels along the y-axis, relative to the last position in the path

Where every odd coordinate is a position for the entity to move to, and every even co-ordinate defines the curve
between the previous and next positions.

This method can be chained with the following methods:

- [delay](#delay)
- [duration](#duration)

If `options` is not an Array, it will error with:

`You need to call moveOnPath with an Array`

If the `options` Array is the wrong size, it will error with:

`You need to call moveOnPath with an odd number of co-ordinates (and at least 3)`


### parabola

```javascript
this.parabola(options);
```

`options` is an object with the following properties:

 - `x` The total distance in pixels to move along the x-axis, relative to the current position
 - `y` The total distance in pixels to move along the y-axis, relative to the current position

This is a convenience method for performing a `moveOnPath` with a 5-point curve.

If `x` and `y` are not defined, it will error with:

`You need to call parabola with an 'x' and 'y' property`


## Known limitations

- As stated above, the method code cannot currently be edited by end users.
- You are restricted to using one `move`, `moveOnPath` or `parabola` call per user method. If several are made, only
the last one will be rendered on the stage.
- Beyond the 'calling' entity, it is not possible to query the properties of other entities in the scene.


## Source code

The JavaScript module that handles the method code is `scripts/models/project/stage_play/proxy_entity_factory.js`.
