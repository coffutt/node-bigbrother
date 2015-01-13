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
    var temp = clone(obj);

    _.each(_.pairs(obj), function (pair) {
        var key = pair[0],
            value = pair[1];

        if (_.isObject(value)) {
            value = recurse(value, function () {
                announceChange(obj);
            });
        }

        if (obj.hasOwnProperty(key)) {
            Object.defineProperty(obj, key, {
                get: function () { return value; },
                set: function (newVal) {
                    temp[key] = newVal;
                    announceChange(temp);
                    value = newVal;
                }
            });
        }
    });

};
