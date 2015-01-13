/*
* big-bro
* https://github.com/craig-o/big-bro
*
* Copyright (c) 2015 Craig Offutt
* Licensed under the MIT license.
*/

'use strict';

var _ = require('lodash');

function clone (obj) {
    return JSON.parse(JSON.stringify(obj));
}

var recurse = module.exports = function (obj, announceChange) {
    // This CANT be the most efficient way to do this. Going to relook later on. There are probably
    // also way too many temp/value/whatever objects in here. In need of serious clean up.
    var temp = clone(obj);

    _.each(_.pairs(obj), function (pair) {
        var key = pair[0],
            value = pair[1];

        if (_.isObject(value)) {
            value = recurse(value, function (t) {
                if (temp[key]) {
                    temp[key] = t;
                }

                announceChange(temp);
            });
        }

        if (_.isArray(value)) {
            var push = value.push;

            value.push = function (val) {
                push.apply(this, value);
                temp[key].push(val);
                announceChange(temp);
            }
        };

        if (obj.hasOwnProperty(key)) {
            Object.defineProperty(obj, key, {
                get: function () {
                    return value;
                },
                set: function (newVal) {
                    temp[key] = newVal;

                    if (_.isObject(newVal)) {
                        value = recurse(newVal, function () {
                            announceChange(temp);
                        });
                    } else {
                        value = newVal;
                    }

                    announceChange(temp);
                }
            });
        }
    });

    return obj;
};
