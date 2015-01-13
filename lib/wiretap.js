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
    // This CANT be the most efficient way to do this. Going to relook later on
    var temp = clone(obj);

    _.each(_.pairs(obj), function (pair) {
        var key = pair[0],
            value = pair[1];

        if (_.isObject(value)) {
            value = recurse(value, function () {
                announceChange(temp);
            });
        }

        if (obj.hasOwnProperty(key)) {
            Object.defineProperty(obj, key, {
                get: function () {
                    return value;
                },
                set: function (newVal) {
                    if (_.isObject(newVal)) {
                        temp[key] = newVal;
                        value = recurse(newVal, function () {
                            announceChange(temp);
                        });
                    } else {
                        temp[key] = newVal;
                    }
                    console.log(temp) 

                    announceChange(temp);
                    value = newVal;
                }
            });
        }
    });

    return obj;
};
