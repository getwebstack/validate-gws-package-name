'use strict'

var scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
var builtins = require('builtins')
var blacklist = [
  'node_modules',
  'favicon.ico',
]

function validate (name) {
  var errors = []

  if (name === null) {
    errors.push('name cannot be null')
    return done(errors)
  }

  if (name === undefined) {
    errors.push('name cannot be undefined')
    return done(errors)
  }

  if (typeof name !== 'string') {
    errors.push('name must be a string')
    return done(errors)
  }

  if (!name.length) {
    errors.push('name length must be greater than zero')
  }

  if (name.match(/^\./)) {
    errors.push('name cannot start with a period')
  }

  if (name.match(/^_/)) {
    errors.push('name cannot start with an underscore')
  }

  if (name.trim() !== name) {
    errors.push('name cannot contain leading or trailing spaces')
  }

  // No funny business
  blacklist.forEach(function (blacklistedName) {
    if (name.toLowerCase() === blacklistedName) {
      errors.push(blacklistedName + ' is a blacklisted name')
    }
  })

  // Generate warnings for stuff that used to be allowed

  // core module names like http, events, util, etc
  builtins({ version: '*' }).forEach(function (builtin) {
    if (name.toLowerCase() === builtin) {
      errors.push(builtin + ' is a core module name')
    }
  })

  if (name.length > 214) {
    errors.push('name can no longer contain more than 214 characters')
  }

  // mIxeD CaSe nAMEs
  if (name.toLowerCase() !== name) {
    errors.push('name can no longer contain capital letters')
  }

  if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
    errors.push('name can no longer contain special characters ("~\'!()*")')
  }

  if (encodeURIComponent(name) !== name) {
    // Maybe it's a scoped package name, like @user/package
    var nameMatch = name.match(scopedPackagePattern)
    if (nameMatch) {
      var user = nameMatch[1]
      var pkg = nameMatch[2]
      if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
        return done(errors)
      }
    }

    errors.push('name can only contain URL-friendly characters')
  }

  return done(errors)
}

var done = function (errors) {
  var result = {
    isValid: errors.length === 0,
    errors: errors,
  }
  if (!result.errors.length) {
    delete result.errors
  }
  return result
}

function isValidVersionFormat (version) {
  const regex = /^[0-9]+\.[0-9]+\.[0-9]+$/i
  return regex.test(version)
}

function isNewerVersion (oldVer, newVer) {
  const oldParts = oldVer.split('.')
  const newParts = newVer.split('.')

  for (let i = 0; i < newParts.length; i++) {
    const a = ~~newParts[i] // parse int
    const b = ~~oldParts[i] // parse int
    if (a > b) {
      return true
    }
    if (a < b) {
      return false
    }
  }
  return false
}

module.exports = {
  validate: validate,
  isValidVersionFormat: isValidVersionFormat,
  isNewerVersion: isNewerVersion,
}
