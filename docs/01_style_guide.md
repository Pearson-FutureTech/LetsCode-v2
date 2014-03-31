# Code Style Guide


## Overview

### EditorConfig

We are specifying the basic code style preferences using [EditorConfig](http://editorconfig.org/), so the easiest way
to align with it is to configure your IDE to pick up the `.editorconfig` files. Your IDE may already support
EditorConfig or there may be a plugin that you can install. Check the site for details.

### JSHint

While `grunt` is running, and each time you run `grunt test`, code style checks will be performed automatically using
JSHint. Please fix any errors it reports.

### General advice

- 4 spaces per indent (not tabs)
- Single quotes in JavaScript
- No trailing whitespace
- Newline at the end of file


## Javascript Style Guide

Based on [Idomatic.js](https://github.com/rwaldron/idiomatic.js/)

### Table of Contents

 * [Whitespace](#whitespace)
 * [Beautiful Syntax](#spacing)
 * [Type Checking (Courtesy jQuery Core Style Guidelines)](#type)
 * [Conditional Evaluation](#cond)
 * [Practical Style](#practical)
 * [Naming](#naming)
 * [Misc](#misc)
 * [Comments](#comments)
 * [One Language Code](#language)

------------------------------------------------

### Preface

The following sections outline a _reasonable_ style guide for modern JavaScript development and are not meant to be prescriptive. The most important take-away is the **law of code style consistency**. Whatever you choose as the style for your project should be considered law. Link to this document as a statement of your project's commitment to code style consistency, readability and maintainability.

### Idiomatic Style Manifesto

1. <a name="whitespace">Whitespace</a>
    - Never mix spaces and tabs.
    - When beginning a project, before you write any code, choose between soft indents (spaces) or real tabs, consider this **law**.
        - For readability, I always recommend setting your editor's indent size to two characters &mdash; this means two spaces or two spaces representing a real tab.
    - If your editor supports it, always work with the "show invisibles" setting turned on. The benefits of this practice are:
        - Enforced consistency
        - Eliminating end of line whitespace
        - Eliminating blank line whitespace
        - Commits and diffs that are easier to read

2. <a name="spacing">Beautiful Syntax</a>

    A. Parens, Braces, Linebreaks

    `if/else/for/while/try` always have braces and span multiple lines

    **Bad**

        if(condition) doSomething();

    **Good**

        if (true) {
            // statements
        } else {
            // statements
        }

        for (var i = 0; i < 10; i++) {
            // statements
        }

    B. Assignments, Declarations, Functions ( Named, Expression, Constructor )

    Using only one `var` per scope (function) promotes readability and keeps your declaration list free of clutter (also saves a few keystrokes).

    **Bad**

        var foo = "bar";
        var num = 1;
        var undef;

        var foo = "bar"
            , num = 1;
            , undef;

    **Good**

        var foo = "bar",
            num = 1,
            undef;

    var statements should always be in the beginning of their respective scope (function). Same goes for const and let from ECMAScript 6.

    **Bad**

        function foo() {
            // some statements here

            var bar = "",
                qux;
        }

    **Good**

        function foo() {
            var bar = "",
                qux;

            // all statements after the variables declarations.
        }


        // Named Function Declaration
        function foo(arg1, argN) {

        }

        // or (and always this way [within blocks](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml#Function_Declarations_Within_Blocks))

        var foo = function(arg1, argN) {
        }

        // Usage
        foo(arg1, argN);

        // Really contrived continuation passing style
        function Square(number, callback) {
            callback(number * number);
        }

        // Usage
        square(10, function(square) {
            // callback statements
        });

        // Constructor Declaration
        function FooBar(options) {
            this.options = options;
        }

        // Usage
        var fooBar = new FooBar({ a: "alpha" });

        fooBar.options;
        // { a: "alpha" }


    C. Quotes

        Whether you prefer single or double shouldn't matter, there is no difference in how JavaScript parses them. What **ABSOLUTELY MUST** be enforced is consistency. **Never mix quotes in the same project. Pick one style and stick with it.**

    D. End of Lines and Empty Lines

        Whitespace can ruin diffs and make changesets impossible to read. Consider incorporating a pre-commit hook that removes end-of-line whitespace and blanks spaces on empty lines automatically.

3. <a name="type">Type Checking (Courtesy jQuery Core Style Guidelines)</a>

    A. Actual Types

    String:

        typeof variable === "string"

    Number:

        typeof variable === "number"

    Boolean:

        typeof variable === "boolean"

    Object:

        typeof variable === "object"

    Array:

        Array.isArray(arrayLikeObject)
        (wherever possible)

    Node:

        elem.nodeType === 1

    null:

        variable === null

    null or undefined:

        variable == null

    undefined:

      Global Variables:

        typeof variable === "undefined"

      Local Variables:

        variable === undefined

      Properties:

        object.prop === undefined
        object.hasOwnProperty(prop)
        "prop" in object

    B. Coerced Types

    Consider the implications of the following...

    Given this HTML:

    	<input type="text" id="foo-input" value="1">

	**Bad**

	    // `foo` has been declared with the value `0` and its type is `number`
	    var foo = 0;

	    // typeof foo;
	    // "number"
	    ...

	    // Somewhere later in your code, you need to update `foo`
	    // with a new value derived from an input element

	    foo = document.getElementById("foo-input").value;

	    // If you were to test `typeof foo` now, the result would be `string`
	    // This means that if you had logic that tested `foo` like:

	    if (foo === 1) {

	        importantTask();

	    }

	    // `importantTask()` would never be evaluated, even though `foo` has a value of "1"


	**Good**

	    // You can preempt issues by using smart coercion with unary + or - operators:

	    foo = +document.getElementById("foo-input").value;
	    //    ^ unary + operator will convert its right side operand to a number

	    // typeof foo;
	    // "number"

	    if (foo === 1) {

	      importantTask();

	    }

	    // `importantTask()` will be called

    Here are some common cases along with coercions:

	    var number = 1,
	        string = "1",
	        bool = false;

	    number;
	    // 1

	    number + "";
	    // "1"

	    string;
	    // "1"

	    +string;
	    // 1

	    +string++;
	    // 1

	    string;
	    // 2

	    bool;
	    // false

	    +bool;
	    // 0

	    bool + "";
	    // "false"

	Evaluators:

	    var number = 1,
	        string = "1",
	        bool = true;

	    string === number;
	    // false

	    string === number + "";
	    // true

	    +string === number;
	    // true

	    bool === number;
	    // false

	    +bool === number;
	    // true

	    bool === string;
	    // false

	    bool === !!string;
	    // true

    parseInt:

	    var num = 2.5;

	    parseInt(num, 10);

	    // is the same as...

	    ~~num;

	    num >> 0;

	    num >>> 0;

	    // All result in 2


	    // Keep in mind however, that negative numbers will be treated differently...

	    var neg = -2.5;

	    parseInt(neg, 10);

	    // is the same as...

	    ~~neg;

	    neg >> 0;

	    // All result in -2
	    // However...

	    neg >>> 0;

	    // Will result in 4294967294


4. <a name="cond">Conditional Evaluation</a>

	    // 4.1.1
	    // When only evaluating that an array has length,
	    // instead of this:
	    if (array.length > 0) ...

	    // ...evaluate truthiness, like this:
	    if (array.length) ...


	    // 4.1.2
	    // When only evaluating that an array is empty,
	    // instead of this:
	    if (array.length === 0) ...

	    // ...evaluate truthiness, like this:
	    if (!array.length) ...


	    // 4.1.3
	    // When only evaluating that a string is not empty,
	    // instead of this:
	    if (string !== "") ...

	    // ...evaluate truthiness, like this:
	    if (string) ...


	    // 4.1.4
	    // When only evaluating that a string _is_ empty,
	    // instead of this:
	    if (string === "") ...

	    // ...evaluate falsy-ness, like this:
	    if (!string) ...


	    // 4.1.5
	    // When only evaluating that a reference is true,
	    // instead of this:
	    if (foo === true) ...

	    // ...evaluate like you mean it, take advantage of built in capabilities:
	    if (foo) ...


	    // 4.1.6
	    // When evaluating that a reference is false,
	    // instead of this:
	    if (foo === false) ...

	    // ...use negation to coerce a true evaluation
	    if (!foo) ...

	    // ...Be careful, this will also match: 0, "", null, undefined, NaN
	    // If you _MUST_ test for a boolean false, then use
	    if (foo === false) ...


	    // 4.1.7
	    // When only evaluating a ref that might be null or undefined, but NOT false, "" or 0,
	    // instead of this:
	    if (foo === null || foo === undefined) ...

	    // ...take advantage of == type coercion, like this:
	    if (foo == null) ...

	    // Remember, using == will match a `null` to BOTH `null` and `undefined`
	    // but not `false`, "" or 0
	    null == undefined

    ALWAYS evaluate for the best, most accurate result - the above is a guideline, not a dogma.

	    // 4.2.1
	    // Type coercion and evaluation notes

	    // Prefer `===` over `==` (unless the case requires loose type evaluation)

	    // === does not coerce type, which means that:

	    "1" === 1;
	    // false

	    // == does coerce type, which means that:

	    "1" == 1;
	    // true


	    // 4.2.2
	    // Booleans, Truthies & Falsies

	    // Booleans:
	    true, false

	    // Truthy:
	    "foo", 1

	    // Falsy:
	    "", 0, null, undefined, NaN, void 0


5. <a name="practical">Practical Style</a>


    A Practical Module

	    (function(global) {
			var Module = (function() {

				var data = "secret";

				return {
					// This is some boolean property
					bool: true,
					// Some string value
					string: "a string",
					// An array property
					array: [1, 2, 3, 4],
					// An object property
					object: {
						lang: "en-Us"
					},
					getData: function() {
						// get the current value of `data`
						return data;
					},
					setData: function(value) {
						// set the value of `data` and return it
						return (data = value);
					}
				};
			})();

			// Other things might happen here

			// expose our module to the global object
			global.Module = Module;

	    })(this);


    A Practical Constructor

	    (function(global) {

			function Ctor(foo) {

				this.foo = foo;

				return this;
			}

			Ctor.prototype.getFoo = function() {
				return this.foo;
			};

			Ctor.prototype.setFoo = function(val) {
				return (this.foo = val);
			};


			// To call constructor's without `new`, you might do this:
			var ctor = function(foo) {
				return new Ctor(foo);
			};


			// expose our constructor to the global object
			global.ctor = ctor;

	    })(this);



6. <a name="naming">Naming</a>

    A. You are not a human code compiler/compressor, so don't try to be one.

    The following code is an example of egregious naming:

	    // Example of code with poor names

	    function q(s) {
	        return document.querySelectorAll(s);
	    }
	    var i,a=[],els=q("#foo");
	    for(i=0;i<els.length;i++){a.push(els[i]);}

    Without a doubt, you've written code like this - hopefully that ends today.

    Here's the same piece of logic, but with kinder, more thoughtful naming (and a readable structure):

	    // Example of code with improved names

	    function query(selector) {
	        return document.querySelectorAll(selector);
	    }

	    var idx = 0,
			elements = [],
			matches = query("#foo"),
			length = matches.length;

	    for ( ; idx < length; idx++ ) {
	        elements.push( matches[ idx ] );
	    }

    A few additional naming pointers:

	    // Naming strings

	    `dog` is a string

	    // Naming arrays

	    `dogs` is an array of `dog` strings

	    // Naming functions, objects, instances, etc

	    camelCase; function and var declarations


	    // 6.A.3.4
	    // Naming constructors, prototypes, etc.

	    PascalCase; constructor function


	    // 6.A.3.5
	    // Naming regular expressions

	    rDesc = //;


	    // 6.A.3.6
	    // From the Google Closure Library Style Guide

	    functionNamesLikeThis;
	    variableNamesLikeThis;
	    ConstructorNamesLikeThis;
	    EnumNamesLikeThis;
	    methodNamesLikeThis;
	    SYMBOLIC_CONSTANTS_LIKE_THIS;

    B. Faces of `this`

    Beyond the generally well known use cases of `call` and `apply`, always prefer `.bind( this )` or a functional equivalent, for creating `BoundFunction` definitions for later invocation. Only resort to aliasing when no preferable option is available.

	    function Device(opts) {

			this.value = null;

			// open an async stream,
			// this will be called continuously
			stream.read(opts.path, function(data) {

				// Update this instance's current value
				// with the most recent value from the
				// data stream
				this.value = data;

			}.bind(this));

			// Throttle the frequency of events emitted from
			// this Device instance
			setInterval(function() {

				// Emit a throttled event
				this.emit("event");

			}.bind(this), opts.freq || 100);
	    }

	    // Just pretend we've inherited EventEmitter ;)

    When unavailable, functional equivalents to `.bind` exist in many modern JavaScript libraries.


	    // eg. lodash/underscore, _.bind()
	    function Device(opts) {

			this.value = null;

			stream.read(opts.path, _.bind(function(data) {

				this.value = data;

			}, this));

			setInterval(_.bind(function() {

				this.emit("event");

			}, this), opts.freq || 100);
	    }

	    // eg. jQuery.proxy
	    function Device(opts) {

			this.value = null;

			stream.read(opts.path, jQuery.proxy(function(data) {

			    this.value = data;

			}, this));

			setInterval(jQuery.proxy(function() {

			    this.emit("event");

			}, this), opts.freq || 100);
	    }

	    // eg. dojo.hitch
	    function Device(opts) {

			this.value = null;

			stream.read(opts.path, dojo.hitch(this, function(data) {

				this.value = data;

			}));

			setInterval(dojo.hitch(this, function() {

				this.emit("event");

			}), opts.freq || 100);
	    }

    As a last resort, create an alias to `this` using `self` as an Identifier. This is extremely bug prone and should be avoided whenever possible.

	    function Device( opts ) {
	        var self = this;

	        this.value = null;

	        stream.read( opts.path, function( data ) {

	            self.value = data;

	        });

	        setInterval(function() {

	            self.emit("event");

	        }, opts.freq || 100 );
	    }


    C. Use `thisArg`

    Several prototype methods of ES 5.1 built-ins come with a special `thisArg` signature, which should be used whenever possible

	    var obj;

	    obj = { f: "foo", b: "bar", q: "qux" };

	    Object.keys( obj ).forEach(function( key ) {

	        // |this| now refers to `obj`

	        console.log( this[ key ] );

	    }, obj ); // <-- the last arg is `thisArg`

	    // Prints...

	    // "foo"
	    // "bar"
	    // "qux"

    `thisArg` can be used with `Array.prototype.every`, `Array.prototype.forEach`, `Array.prototype.some`, `Array.prototype.map`, `Array.prototype.filter`

7. <a name="misc">Misc</a>

    This section will serve to illustrate ideas and concepts that should not be considered dogma, but instead exists to encourage questioning practices in an attempt to find better ways to do common JavaScript programming tasks.

    B. Early returns promote code readability with negligible performance difference

		**Bad**

		    function returnLate(foo) {
				var ret;

				if (foo) {
				    ret = "foo";
				} else {
				    ret = "quux";
				}
				return ret;
		    }

		**Good**

		    function returnEarly(foo) {

		      if (foo) {
		          return "foo";
		      }
		      return "quux";
		    }

8. <a name="comments">Comments</a>

	    #### Single line above the code that is subject
	    #### Multiline is good
	    #### End of line comments are prohibited!
	    #### JSDoc style is good, but requires a significant time investment


9. <a name="language">One Language Code</a>

    Programs should be written in one language, whatever that language may be, as dictated by the maintainer or maintainers.

### Appendix

#### Comma First.

Any project that cites this document as its base style guide will not accept comma first code formatting, unless explicitly specified otherwise by that project's author.


----------


<a rel="license" href="http://creativecommons.org/licenses/by/3.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/3.0/80x15.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Principles of Writing Consistent, Idiomatic JavaScript</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/rwldrn/idiomatic.js" property="cc:attributionName" rel="cc:attributionURL">Rick Waldron and Contributors</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/3.0/deed.en_US">Creative Commons Attribution 3.0 Unported License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/rwldrn/idiomatic.js" rel="dct:source">github.com/rwldrn/idiomatic.js</a>.



