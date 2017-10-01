/*!
 * htamale: test/_html.t.js
 */
'use strict';

const cheerio = require('cheerio'),
  expect = require('chai').expect,
  html = require('../lib/utils/_html');

describe('lib/utils/_html', function () {
  const obj = {
    type: 'html',
    tag: 'p',
    attr: {
      'ht-test': 'init'
    },
    class: ['class1', 'class2']
  };

  const opts = {
    html: cheerio.load('<p class="class1 class3" ht-test="old">test</p>')('p')
  };

  it('only needs a tag', function() {
    const _obj = {
      type: 'html',
      tag: 'p'
    };
    expect( html(_obj) ).to.equal('<p></p>');
  });

  it('creates object correctly', function () {
    const $ = cheerio.load( html(obj) )(obj.tag);
    
    expect( $.attr('ht-test') ).to.equal('init');
    expect( $.hasClass('class1') ).to.be.true;
    expect( $.hasClass('class2') ).to.be.true;
    expect( $.hasClass('class3') ).to.be.false;
  });

  it('edits exhisting object correctly', function () {
    const $ = cheerio.load( html(obj, opts) )(obj.tag);
    
    expect( $.attr('ht-test') ).to.equal('init');
    expect( $.hasClass('class1') ).to.be.true;
    expect( $.hasClass('class2') ).to.be.true;
    expect( $.hasClass('class3') ).to.be.true;
  });

  it('will replace content with text', function () {
    obj.html = 'text';

    const $ = cheerio.load( html(obj) )(obj.tag);

    expect( $.html() ).to.equal('text');
  });

  describe('throws', function () {
    const _obj = {
      type: 'html',
      tag: 'p'
    };

    it('when tag mismatches', function () {
      const _opts = {
        html: cheerio.load('<h1>test</h1>')('h1')
      };
      
      expect( html.bind(null, obj, _opts) ).to.throw();
    });

    it('when attribute is not an object', function () {
      _obj.attr = 42;

      expect( html.bind(null, _obj) ).to.throw();
    });

    it('when attribute is an array', function () {
      _obj.attr = [];

      expect( html.bind(null, _obj) ).to.throw();
    });

    it('when attribute is not an object', function () {
      _obj.attr = 42;

      expect( html.bind(null, _obj) ).to.throw();
    });

    it('when class is not an array', function () {
      delete _obj.attr;
      _obj.class = 42;

      expect( html.bind(null, _obj) ).to.throw();
    });
  });
});