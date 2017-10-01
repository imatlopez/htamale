/*!
 * htamale: test/01a.router.js
 */
'use strict';

const expect = require('chai').expect,
  parse = require('../lib/utils/router');


describe('lib/utils/router.js', function () {
  it('undefined => undefined', function () {
    expect( parse() ).to.be.an('undefined');
  });

  it('string => string', function () {
    const val = 'test';
    expect( parse(val) ).to.equal(val);
  });

  it('number => "number"', function () {
    const val = 42;
    expect( parse(val) ).to.equal(String(val));
  });

  it('string[] => string', function () {
    const val = ['test1', 'test2'];
    const res = 'test1\ntest2';
    expect( parse(val) ).to.equal(res);
  });

  it('general object => null', function () {
    expect( parse({}) ).to.equal(null);
  });

  it('default types => strings', function () {
    expect( parse({ type: 'datetime', year: 2017 }) ).to.equal('2017');
    expect( parse({ type: 'interval', start: 'a', end: 'b' }) ).to.equal('a - b');
    expect( parse({ type: 'html', tag: 'p'}) ).to.equal('<p></p>');
  });

  describe('nested input', function () {
    it('in obj', function() {
      const obj = {type: 'html', tag: 'p'};
      expect( parse({ type: 'html', tag: 'p', html: obj }) ).to.equal('<p><p></p></p>');
    });

    it('in opts', function() {
      const obj = {
        type: 'interval',
        start: { type: 'datetime', year: 2016},
        end: { type: 'datetime', year: 2017 }
      };
      const opts = {
        delim: { type: 'html', tag: 'span', html: '&#x2013;'}
      };
      expect( parse(obj, opts) ).to.equal('2016<span>&#x2013;</span>2017');
    });
  });

  describe('throws', function () {
    it('given a function', function () {
      expect( parse.bind(null, ()=>{}) ).to.throw();
    });
  });
});