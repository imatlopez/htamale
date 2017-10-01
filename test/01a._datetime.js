/*!
 * htamale: test/01a._datetime.js
 */
'use strict';

const expect = require('chai').expect,
  datetime = require('../lib/utils/_datetime');

describe('lib/utils/_datetime.js', function () {
  describe('gen1 format', function () {
    const obj = {
      type: 'date',
      format: 'gen1',
      year: 2017
    };

    it('should return YYYY if no month is given', function () {
      expect( datetime(obj) ).to.equal('2017');
    });

    it('should return MMMM YYYY if month is given', function () {
      obj.month = 5;
      expect( datetime(obj) ).to.equal('June 2017');
    });
  });

  describe('gen2 format', function () {
    const obj = {
      type: 'date',
      format: 'gen2',
      year: 2017
    };

    it('should return YYYY if no month is given', function () {
      expect( datetime(obj) ).to.equal('2017');
    });

    it('should return MMM YYYY if month is given', function () {
      obj.month = 5;
      expect( datetime(obj) ).to.equal('Jun 2017');
    });
  });

  describe('custom format', function () {
    const obj = {
      type: 'date',
      format: 'YYYY-MM-DD',
      year: 2017,
      month: 5
    };

    it('should default day to today if no day is given', function () {
      let today = (new Date).getDate();
      today = `${today < 10 ? '0' : ''}${today}`;

      expect( datetime(obj) ).to.equal(`2017-06-${today}`);
    });

    it('should return YYYY-MM-DD if day is given', function () {
      obj.date = 15;
      expect( datetime(obj) ).to.equal('2017-06-15');
    });
  });

  describe('heirarchies', function () {
    const obj = {
      type: 'date',
      year: 2017,
      month: 5,
      date: 15
    };
    const opts = {
      format: 'MMYY'
    };

    it('default format is gen1', function () {
      expect( datetime(obj) ).to.equal('June 2017');
    });

    it('object format supersedes default', function () {
      obj.format = 'gen2';
      expect( datetime(obj) ).to.equal('Jun 2017');
    });

    it('options format supersedes object format', function () {
      expect( datetime(obj, opts) ).to.equal('0617');
    });
  });
});