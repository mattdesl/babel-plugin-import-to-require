const babel = require('babel-core');
const tape = require('tape');

tape('should transform', t => {
  const result = babel.transform(`import foo from 'foobar';`.trim(), {
    plugins: require.resolve('../')
  });
  t.equal(result.code, "const foo = require('foobar');");
  t.end();
});

tape('should transform all', t => {
  const result = babel.transform(`
const a = require('./a');
import blah from './blah';
import foo from 'foobar';
  `.trim(), {
    plugins: [
      [ require.resolve('../'), {} ]
    ]
  });
  t.equal(result.code, `
const a = require('./a');

const blah = require('./blah');

const foo = require('foobar');
  `.trim());
  t.end();
});

tape('should skip import specifiers that are not simple', t => {
  const result = babel.transform(`
const a = require('./a');
import { blah } from './blah';
import foo from 'foobar';
  `.trim(), {
    plugins: [
      [ require.resolve('../'), {} ]
    ]
  });
  t.equal(result.code, `
const a = require('./a');
import { blah } from './blah';

const foo = require('foobar');
  `.trim());
  t.end();
});

tape('transform none', t => {
  const result = babel.transform(`
const a = require('./a');
import foo from 'foobar';
const b = require('./b');
  `.trim(), {
    plugins: [
      [ require.resolve('../'), { modules: [] } ]
    ]
  });
  t.equal(result.code, `
const a = require('./a');
import foo from 'foobar';
const b = require('./b');
  `.trim());
  t.end();
});

tape('transform some with modules array', t => {
  const result = babel.transform(`
import a from 'a';
import foo from 'foobar';
import b from 'b';
import c from 'c';
  `.trim(), {
    plugins: [
      [ require.resolve('../'), { modules: [ 'a', 'b' ] } ]
    ]
  });
  t.equal(result.code, `
const a = require('a');

import foo from 'foobar';

const b = require('b');

import c from 'c';
  `.trim());
  t.end();
});
