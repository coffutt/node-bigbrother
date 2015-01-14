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

    it('should handle object re-assigns', function (done) {
        var littleBro = { a: 'A', b: { c: 'D' }};

        var bro = bigBro({
            obj: littleBro,
            callbacks: function (current) {
                expect(current).to.deep.equal({
                    a: 'A',
                    b: {
                        d: 'E'
                    }
                });
                done();
            }
        });

        littleBro.b = { d: 'E' };
    });

    it('should handle number++', function (done) {
        var littleBro = { a: 0 };

        var bro = bigBro({
            obj: littleBro,
            callbacks: function (current) {
                expect(current).to.deep.equal({ a: 1 });
                done();
            }
        });

        littleBro.a++;
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
        it ('should handle push', function (done) {
            var littleBro = [1, 2, 3];

            var bro = bigBro({
                obj: littleBro,
                callbacks: function (current) {
                    expect(current).to.deep.equal([1,2,3,4]);
                    done();
                }
            });

            littleBro.push(4);
        });

        it('should handle index selected changes', function (done) {
            var littleBro = [1, 2, 3];

            var bro = bigBro({
                obj: littleBro,
                callbacks: function (current) {
                    expect(current).to.deep.equal([1,2,4]);
                    done();
                }
            });

            littleBro[2] = 4;
        });
    });

    it('should pause execution callback executions', function (done) {
        var littleBro = { a: 'A' };

        var bro = bigBro({
            obj: littleBro,
            callbacks: function (current) {
                expect(true).to.be.false;
            }
        });

        bro.suspend();
        littleBro.a = 'B';
        setTimeout(done, 1000);
    });

    it('should resume paused execution', function (done) {
        var littleBro = { a: 'A', b: 'B' };

        var bro = bigBro({
            obj: littleBro,
            callbacks: function (current) {
                expect(current).to.deep.equal({ a: 'C', b: 'D'});
                done();
            }
        });

        bro.suspend();
        littleBro.a = 'C';
        bro.resume();
        littleBro.b = 'D';
    });

    it('should add a listener', function (done) {
        var littleBro = { a: 'A', b: 'B' },
            aCalled = 0;

        var bro = bigBro({
            obj: littleBro,
            callbacks: function (current) {
                if (aCalled === 0) {
                    expect(current).to.deep.equal({ a: 'C', b: 'B' });
                } else if (aCalled === 1){
                    expect(current).to.deep.equal({ a: 'C', b: 'D' });
                }

                aCalled++;
            }
        });

        littleBro.a = 'C';
        bro.addListener(function (current) {
            expect(aCalled).to.equal(2);
            expect(current).to.deep.equal({ a: 'C', b: 'D' });
            done();
        });
        littleBro.b = 'D';
    });

    it('should clear listeners', function () {
        var littleBro = { a: 'A' };

        var bro = bigBro({
            obj: littleBro,
            callbacks: function (current) {
                expect(true).to.be.false;
            }
        });

        bro.clearListeners();
        
        littleBro.a = 'C';
    });
});
