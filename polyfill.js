'use strict'

global.Buffer = global.Buffer || require('buffer').Buffer

if (!process.version) process.version = 'v0.10'
process.nextTick = process.nextTick || setImmediate
