Let's Code!
===========

Let's Code! is a free, open source web application for young people to learn programming skills in a fun, creative way.

Check out the [live site](http://letsc.de) to see how it works.


## To get up and running on your local machine


### Pre-requisites

* `nodejs`
* `bower`
* `ruby`
* `mongodb`

### First time run

1. Clone this repository

2. Make sure you have [grunt-cli installed](http://gruntjs.com/getting-started)

3. Run `npm install`

4. Run `bower install`

5. Add the following environment variables:

    LETS\_CODE\_COOKIE\_SECRET="some string you can set to whatever you want"
    LETS\_CODE\_SESSION\_SECRET="another string that can be whatever you want"

(If you don't know how to do this, see this [superuser post](http://superuser.com/questions/284342/what-are-path-and-other-environment-variables-and-how-can-i-set-or-use-them))

6. To use the grunt-contrib-compass plugin you will need to make sure you have the
Compass Ruby gem installed. Follow the [instructions in the plugins readme](https://github.com/gruntjs/grunt-contrib-compass)
to see how.

7. Run `grunt seed` to pre-seed the database

8. Run `grunt` to run the site

### Issues

If you get an error `require: cannot load such file -- sass/script/node`
Then try [uninstalling and reinstalling the sass gem](http://stackoverflow.com/questions/16877028/why-does-compass-watch-say-it-cannot-load-sass-script-node-loaderror).


## Development

### Architecture/Structure

Let's Code! is built using [Backbone](http://backbonejs.org/) and [Marionette](http://marionettejs.com/).

We're using a modular approach, utilising the "mediator" pattern, with
[backbone.wreqr](https://github.com/marionettejs/backbone.wreqr).

For an intro to this general approach, see:

[www.slideshare.net/matt-briggs/marionette-structure-with-modules](http://www.slideshare.net/matt-briggs/marionette-structure-with-modules)


### Integration tests

To run the integration tests you will also need to install:

* [phantomjs](http://phantomjs.org/)
* [casperjs](http://casperjs.org/) - note that to use the casperjs test API you
will need to [install](http://docs.casperjs.org/en/latest/installation.html)
version 1.1 or greater. See the [upgrade page](http://docs.casperjs.org/en/latest/upgrading/1.1.html)
for more details on the differences.


### Notes

* While running `grunt`, the `Sass` files are compiled automatically when they're saved (it may take a couple of
seconds though - check the terminal output).


## Tailoring the setup

Configuration settings defined in either `server/default.json` or
`server/development` can be overridden in one of two ways:

1. Create a new config file, `server/local.json`, and provide an
alternative value.
2. Pass in a command line argument or set an environment variable. See [nconf](https://github.com/flatiron/nconf)
for more details.


## Documentation

See the [Docs](docs/index.md) for information on:

- [Style Guide](docs/01_style_guide.md)
- [Projects](docs/02_projects.md)
- [Entities](docs/03_entities.md)
- [Methods](docs/04_methods.md)
- [Tutorials](docs/05_methods.md)


## License

Apache v2. See [LICENSE.txt](LICENSE.txt).


## Thanks

Special thanks to everyone who contributed to the development, including:

 - Edward Ruchevits
 - Gareth Edwards
 - Phil Powell
 - Adaptive Lab

And to all who have provided feedback and advice.


## Questions/Feedback

Email future_tech [at] pearson.com.

