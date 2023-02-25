'use strict'

var validate = require('..').validate
var validateVersionFormat = require('..').validateVersionFormat
var isNewerVersion = require('..').isNewerVersion
var test = require('tap').test

test('validate-gws-package-name - validate', function (t) {
  // Traditional

  t.same(validate('some-package'), { valid: true })
  t.same(validate('example.com'), { valid: true })
  t.same(validate('under_score'), { valid: true })
  t.same(validate('period.js'), { valid: true })
  t.same(validate('123numeric'), { valid: true })
  t.same(validate('crazy!'), {
    valid: false,
    errors: ['name can no longer contain special characters ("~\'!()*")'],
  })

  // Scoped (npm 2+)

  t.same(validate('@npm/thingy'), { valid: true })
  t.same(validate('@npm-zors/money!time.js'), {
    valid: false,
    errors: ['name can no longer contain special characters ("~\'!()*")'],
  })

  // Invalid

  t.same(validate(null), {
    valid: false,
    errors: ['name cannot be null'] })

  t.same(validate(undefined), {
    valid: false,
    errors: ['name cannot be undefined'] })

  t.same(validate(42), {
    valid: false,
    errors: ['name must be a string'] })

  t.same(validate(''), {
    valid: false,
    errors: ['name length must be greater than zero'] })

  t.same(validate('.start-with-period'), {
    valid: false,
    errors: ['name cannot start with a period'] })

  t.same(validate('_start-with-underscore'), {
    valid: false,
    errors: ['name cannot start with an underscore'] })

  t.same(validate('contain:colons'), {
    valid: false,
    errors: ['name can only contain URL-friendly characters'] })

  t.same(validate(' leading-space'), {
    valid: false,
    errors:
      ['name cannot contain leading or trailing spaces',
        'name can only contain URL-friendly characters'],
  })

  t.same(validate('trailing-space '), {
    valid: false,
    errors:
      ['name cannot contain leading or trailing spaces',
        'name can only contain URL-friendly characters'],
  })

  t.same(validate('s/l/a/s/h/e/s'), {
    valid: false,
    errors: ['name can only contain URL-friendly characters'] })

  t.same(validate('node_modules'), {
    valid: false,
    errors: ['node_modules is a blacklisted name'] })

  t.same(validate('favicon.ico'), {
    valid: false,
    errors: ['favicon.ico is a blacklisted name'] })

  // Node/IO Core

  t.same(validate('http'), {
    valid: false,
    errors: ['http is a core module name'] })

  t.deepEqual(validate('process'), {
    valid: false,
    errors: ['process is a core module name'] })

  // Long Package Names

  /* eslint-disable-next-line max-len */
  t.same(validate('ifyouwanttogetthesumoftwonumberswherethosetwonumbersarechosenbyfindingthelargestoftwooutofthreenumbersandsquaringthemwhichismultiplyingthembyitselfthenyoushouldinputthreenumbersintothisfunctionanditwilldothatforyou-'), {
    valid: false,
    errors: ['name can no longer contain more than 214 characters'],
  })

  /* eslint-disable-next-line max-len */
  t.same(validate('ifyouwanttogetthesumoftwonumberswherethosetwonumbersarechosenbyfindingthelargestoftwooutofthreenumbersandsquaringthemwhichismultiplyingthembyitselfthenyoushouldinputthreenumbersintothisfunctionanditwilldothatforyou'), {
    valid: true,
  })

  // Legacy Mixed-Case
  t.same(validate('CAPITAL-LETTERS'), {
    valid: false,
    errors: ['name can no longer contain capital letters'] })

  t.end()
})

test('validate-gws-package-name - validateVersionFormat', function (t) {
  // Traditional

  t.same(validateVersionFormat('1.1.2'), true)
  t.same(validateVersionFormat('10.0.0'), true)
  t.same(validateVersionFormat('a.1.2'), false)
  t.same(validateVersionFormat('1.b.2'), false)
  t.same(validateVersionFormat('1.1.c'), false)

  t.same(validateVersionFormat('&.1.c'), false)
  t.same(validateVersionFormat('.1.c'), false)
  t.same(validateVersionFormat(' .1.c'), false)
  t.same(validateVersionFormat('*.1.c'), false)
  t.same(validateVersionFormat('1.1'), false)
  t.same(validateVersionFormat('1'), false)
  t.same(validateVersionFormat('1.1.1.1'), false)
  t.end()
})
test('validate-gws-package-name - isNewerVersion', function (t) {
  // Traditional
  t.same(isNewerVersion('1.1.2', '1.1.3'), true)
  t.same(isNewerVersion('1.1.3', '1.2.0'), true)
  t.same(isNewerVersion('1.1.2', '2.1.1'), true)

  t.same(isNewerVersion('1.2.2', '1.2.2'), false)
  t.same(isNewerVersion('1.1.2', '1.0.2'), false)
  t.same(isNewerVersion('10.0.0', '9.9.9'), false)
  t.same(isNewerVersion('10.0.1', '10.0.0'), false)

  t.end()
})
