'use strict';

var expect = require('chai').expect,
    bigBro = require('../lib/big-bro.js');

describe('Big Bro', function () {

    var bro,
        littleBro;

    before(function () {
        littleBro = {
            a: 'A',
            b: 'B',
            c: {
                d: 'D',
                e: 'E'
            }
        };
    });

    it('should build a bro', function () {
        var bro = bigBro({ obj: littleBro });
        expect(bro.suspend).to.be.a.Function;
        expect(bro.resume).to.be.a.Function;
        expect(bro.addListener).to.be.a.Function;
        expect(bro.clearListeners).to.be.a.Function;
    });

    it('should fire off event listeners when little bro changes', function (done) {
        var numChanges = 0;

        var bro = bigBro({
            obj: littleBro,
            callbacks: function (current) {
                var expected = {
                    1: {
                        a: 'F',
                        b: 'B',
                        c: {
                            d: 'D',
                            e: 'E'
                        }
                    },
                    2: {
                        a: 'F',
                        b: 'B',
                        c: {
                            d: 'G',
                            e: 'E'
                        }
                    }
                };

                expect(current).to.deep.equal(expected[numChanges]);
                if (numChanges === 2){
                    done();
                }
            }
        });

        numChanges++;
        littleBro.a = 'F';
        numChanges++;
        littleBro.c.d = 'G';
    });

});
