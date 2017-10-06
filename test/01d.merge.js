/*!
 * htamale: test/01d.merge.js
 */
'use strict';

const  expect = require('chai').expect,
  fs = require('fs'),
  merge = require('../lib/utils/merge');


/**
 * Binds n parameters to merge
 * 
 * @param {Object[]} arr 
 * @returns {Function}
 * @api private
 */
function bindToMerge(arr) {
  return arr.reduce(function (prev, curr) {
    return prev.bind(undefined, curr);
  }, merge);
}

describe('lib/utils/merge.js', function () {
  const obj1 = { key1: 'value1', key2: 'value1' };
  const obj2 = { key1: 'value2', key3: 'value2'};
  const res12 = { key1: 'value1', key2: 'value1', key3: 'value2'};

  it('returns undefined when it\'s given no objects', function () {
    expect( merge() ).to.be.an('undefined');
  });

  describe('given only one argument', function () {
    it('object', function () {
      expect( merge(obj1) ).to.deep.equal(obj1);
    });
  
    it('file path', function () {
      const path1 = 'test/tests/01d.simple.json';
      const obj1p = JSON.parse(fs.readFileSync(path1));
  
      expect( merge(path1) ).to.deep.equal(obj1p);
    });
  });

  describe('given more than one argument', function () {
    it('object, object', function () {
      expect( merge(obj1, obj2) ).to.deep.equal(res12);
    });

    it('object twice', function () {
      expect( merge(obj1, obj1) ).to.deep.equal(obj1);
    });
  
    it('object, path', function () {
      const path2 = 'test/tests/01d.simple.json';
  
      expect( merge(obj1, path2) ).to.deep.equal(res12);
    });

    it('null, object', function () {
      expect( merge(null, obj1) ).to.deep.equal(obj1);
    });

    describe('has array', function () {
      it ('simple array, object', function () {
        const obj1a = [obj1, obj1];
        const res1a2 = [res12, res12];

        expect( merge(obj1a, obj2) ).to.deep.equal(res1a2);
      });

      it('mixed array, object', function() {
        const obj1a = [obj1, 'seed1'];
        const res1a2 = [res12, 'seed1'];
    
        expect( merge(obj1a, obj2) ).to.deep.equal(res1a2);
      });
  
      it('multilayer array, object', function() {
        const obj1a = [obj1, [obj1, obj1]];
        const res1a2 = [res12, [res12, res12]];
    
        expect( merge(obj1a, obj2) ).to.deep.equal(res1a2);
      });
    });

    describe('with multilayer object in pair', function () {
      const obj1c = { key1: obj1, key2: 'value1' };
      const obj2c = { key1: obj1, key3: 'value2' };
      const res1c2c = { key1: obj1, key2: 'value1', key3: 'value2'};

      it('first', function () {
        expect( merge(obj1c, obj2) ).to.deep.equal(res1c2c);
      });

      it('second', function () {
        expect( merge(obj1, obj2c) ).to.deep.equal(res12);
      });

      it('both', function () {
        expect( merge(obj1c, obj2c) ).to.deep.equal(res1c2c);
      });
    });

  });

  describe('throws', function () {
    it('a non-object is given', function () {
      const fun = bindToMerge([42]);

      expect( fun ).to.throw();
    });

    it('an invalid path to file is given', function() {
      const fun = bindToMerge(['package']);

      expect( fun ).to.throw();
    });

    it('an invalid JSON file is given', function() {
      const fun = bindToMerge(['LICENSE']);

      expect( fun ).to.throw();
    });

    describe('has array', function () {
      it('object, nested array', function () {
        const fun = bindToMerge([obj1, { key1: [obj2, obj2], key3: 'value2' }]);

        expect( fun ).to.throw();
      });

      it('len 2 array, len 3 array', function () {
        const fun = bindToMerge([[obj1, obj1], [obj2, obj2, obj2]]);

        expect( fun ).to.throw();
      });
    });
  });
});