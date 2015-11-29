#!/usr/bin/env node

import * as glob from 'glob';
import * as path from 'path';
const cli = require('cli');
const madge = require('madge');

cli.parse({
  extension: ['x', 'look for files with extension', 'string', 'ts'],
  exclude:   ['e', 'exclude files matching regex string', 'string', '/test/|/bin/'],
  relativeonly:   ['r', 'find relative imports only', false, true],
  // root: [false, 'Find orphan js files in folder', 'path', '.']
});

cli.main((args, options: {root: string, extension: string, exclude?: string, relativeonly: boolean}) => {
  const {extension: ext} = options;

  let exclude = /$.^/;
  if (options.exclude) {
    exclude = new RegExp(options.exclude);
  }

  const cwd = process.cwd();

  interface ITree {
    [key: string]: string[];
  }
  const tree: ITree = madge('.', { exclude: 'node_modules' }).tree;

  const reverseTree: ITree = {};
  Object.keys(tree).forEach((source) => {
    const files = tree[source];

    files.forEach(file => {
      reverseTree[file] = reverseTree[file] || [];
      reverseTree[file].push(source);
    });
  });

  // const counts = Object.keys(reverseTree).map((file) => ({file, refs: reverseTree[file].length})).sort((a, b) => a.refs - b.refs);
  // counts.forEach(count => {
  //   console.log(count.refs, count.file);
  // });

  const files = glob.sync('./**/*.' + ext, {ignore: './node_modules/**'})
    .filter(path => !exclude.test(path))
    .filter(path => (!options.relativeonly) || path.indexOf('./') === 0) // ignore non-relative files
    .filter(path => path.indexOf('.d.ts') === -1) // ignore declaration files
  ;

  function hasRefs(path: string): boolean { return Object.prototype.hasOwnProperty.call(reverseTree, path)};
  const hasProp = Object.prototype.hasOwnProperty;
  const orphans = files
  .filter(path =>
    !hasRefs(path.replace(/^\.\//, '')) &&
    !hasRefs(path.substr(0, path.length - ext.length - 1).replace(/^\.\//, ''))
  );

  orphans.forEach(file => console.log(file));
});
