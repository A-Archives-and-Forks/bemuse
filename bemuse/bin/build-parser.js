#!/usr/bin/env node
'use strict'

// Regenerates src/scintillator/expression/parser.js from parser.pegjs.
//
//   rushx build:parser
//
// parser.js is a committed build artifact (imported directly so the source
// doesn't depend on a webpack pegjs-loader). CI runs this script and fails if
// the committed file is out of date — see the "tidy" job in .github/workflows/ci.yml.

const fs = require('fs')
const path = require('path')
const peg = require('pegjs')

const dir = path.join(__dirname, '..', 'src', 'scintillator', 'expression')
const grammar = fs.readFileSync(path.join(dir, 'parser.pegjs'), 'utf8')

const header =
  '// GENERATED FILE — do not edit. Regenerate with `rushx build:parser`.\n'
const source = peg.generate(grammar, { output: 'source', format: 'commonjs' })

fs.writeFileSync(path.join(dir, 'parser.js'), header + source)
