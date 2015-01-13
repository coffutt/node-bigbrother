/*
 * big-bro
 * https://github.com/craig-o/big-bro
 *
 * Copyright (c) 2015 Craig Offutt
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash'),
    wiretap = require('./wiretap');

module.exports = function (config) {

    var callbacks = config.callbacks || [],
        obj = wiretap(config.obj || {}, function (old, knew) {
            _.each(callbacks, function (fn) {
                if (listening) fn(old, knew);
            });
        }),
        listening = true;

    // Allow user to config callbacks as a single function or an array
    if (_.isFunction(callbacks)) {
        callbacks = [callbacks];
    }

    return {

        suspend: function () {
            listening = false;
        },

        resume: function () {
            listening = true;
        },

        addListener: function (cb) {
            callbacks.push(cb);
        },

        clearListeners: function () {
            callbacks = [];
        }
    };
};
