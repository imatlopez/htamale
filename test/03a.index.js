/*!
 * htamale: test/03a.index.js
 */
'use strict';

const expect = require('chai').expect,
  index = require('../lib/index');


describe('lib/index.js', function () {
  const wrap = (str) => `<html><head></head><body>${str}</body></html>`;

  it('undefined => undefined', function () {
    expect( index() ).to.be.an('undefined');
    expect( index('') ).to.be.an('undefined');
  });

  it('simple html => unchanged', function () {
    const str = '<p></p>';
    const cfg = {};
    expect( index(str, cfg) ).to.equal(wrap(str));
  });

  it('target html => changed', function () {
    const str = '<p ht-target="foo"></p><p></p>';
    const res = '<p>bar</p><p></p>';
    const cfg = { foo: 'bar' };
    expect( index(str, cfg) ).to.equal(wrap(res));
  });

  it('append html => changed', function () {
    const str = '<p ht-target="foo" ht-append></p><p></p>';
    const res = '<p class="foo">bar</p><p></p>';
    const cfg = { foo: { type: 'html', tag: 'p', class: ['foo'], html: 'bar' } };
    expect( index(str, cfg) ).to.equal(wrap(res));
  });

  describe('array', function () {
    const obj = { type: 'html', tag: 'li' };
    const res = '<ul><li></li><li></li><li></li></ul><ul></ul>';

    it ('simple html => multiple', function () {
      const str = '<ul ht-target="foo"></ul><ul></ul>';
      const cfg = { foo: [obj, obj, obj] };
      expect( index(str, cfg) ).to.equal(wrap(res));
    });

    it ('append html => multiple', function () {
      const str = '<ul><li ht-target="foo" ht-append></li></ul><ul></ul>';
      const cfg = { foo: [obj, obj, obj] };
      expect( index(str, cfg) ).to.equal(wrap(res));
    });
  });

  describe('throws', function () {
    it('when target is not found', function () {
      const str = '<p ht-target="foo.bar"></p><p></p>';
      const cfg = { foo: { notbar: 'baz' } };

      expect( index.bind(null, str, cfg) ).to.throw();
    });
  });
});