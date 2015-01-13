# big-bro

Node module for watching an object for changes. WORK IN PROGRESS.

## Getting Started
Install the module with: `npm install big-bro`

## Documentation

Big brother gives you the ability to watch a model objects fields and asynchronously act on changes.

### Example

```javascript

var bigbro = require('big-bro');

var anObj = {
    a: 'A',
    b: 'B',
    c: {
        d: 'D',
        e: 'E'
    }
};

// Instantiate wiretapping of your model object. Callbacks can be a single function
// or an array of functions.
var holder = bigbro({
    obj: anObj,
    callbacks: function (updatedObj) {
        // Do something with the updated version of your model object.
    }
});

// Add another wiretapper.
holder.addListener(function (updatedObj) {
    // Do another thing with the updated version.
});

// Pause all callbacks. Objet will still update but callbacks won't fire.
holder.suspend();

// Resume the execution of callbacks.
holder.resume();

// Remove all callbacks for good.
holder.clearListeners();

```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using 'make'

## License
Copyright (c) 2015 Craig Offutt. Licensed under the MIT license.
