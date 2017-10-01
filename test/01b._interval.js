/*!
 * htamale: test/_interval.t.js
 */
'use strict';

const expect = require('chai').expect,
  interval = require('../lib/utils/_interval');

describe('lib/utils/_interval.js', function () {

  describe('single element, no delimter', function () {
    it('has no end', function () {
      const obj = {
        type: 'interval',
        start: '2016'
      };

      expect( interval(obj) ).to.equal('2016');
    });

    it('has no start', function () {
      const obj = {
        type: 'interval',
        end: '2017'
      };

      expect( interval(obj) ).to.equal('2017');
    });
  });

  it('start and end, no delimeter', function () {
    const obj = {
      type: 'interval',
      start: '2016',
      end: '2017'
    };

    expect( interval(obj) ).to.equal('2016 - 2017');
  });

  describe('heirarchy', function () {
    it('start and end, custom delimeter', function () {
      const obj = {
        type: 'interval',
        delim: '/',
        start: '2016',
        end: '2017'
      };

      expect( interval(obj) ).to.equal('2016/2017');
    });

    it('start and end, custom delimeter and override', function () {
      const obj = {
        type: 'interval',
        delim: '/',
        start: '2016',
        end: '2017'
      };

      const opts = {
        delim: '<span>&ndash;</span>'
      };

      expect( interval(obj,opts) ).to.equal('2016<span>&ndash;</span>2017');
    });
  });

});