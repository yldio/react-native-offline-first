'use strict'

global.Buffer = global.Buffer || require('buffer').Buffer

if (!process.version) process.version = '';
process.nextTick = process.nextTick || setImmediate
