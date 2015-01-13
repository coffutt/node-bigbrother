'use strict';

var expect = require('chai').expect,
    bigBro = require('../lib/big-bro.js');

describe('Big Bro', function () {

    it('should build a bro', function () {
        var bro = bigBro({ obj: { } });
        expect(bro.suspend).to.be.a.Function;
        expect(bro.resume).to.be.a.Function;
        expect(bro.addListener).to.be.a.Function;
        expect(bro.clearListeners).to.be.a.Function;
    });

    it('should fire off event listeners when little bro changes', function (done) {
        var littleBro = {
                a: 'A',
                b: 'B',
                c: {
                    d: 'D',
                    e: 'E'
                }
            },
            numChanges = 0;

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

    describe('arrays', function () {
        it('should handle push', function (done) {
            var littleBro = { a: [1, 2, 3] };

            var bro = bigBro({
                obj: littleBro,
                callbacks: function (current) {
                    expect(current).to.deep.equal({ a: [1,2,3,4] });
                    done();
                }
            });

            littleBro.a.push(4);
        });

        it('should handle index selected changes', function (done) {
            var littleBro = { a: [1, 2, 3] };

            var bro = bigBro({
                obj: littleBro,
                callbacks: function (current) {
                    expect(current).to.deep.equal({ a: [1,2,4] });
                    done();
                }
            });

            littleBro.a[2] = 4;
        });
    });

    describe('flat array objects', function () {
        // TODO handle watching a flat array.
    });

});
