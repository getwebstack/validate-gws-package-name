# validate-gws-package-name

Give me a string and I'll tell you if it's a valid `gws` package name.

This package exports a single synchronous function that takes a `string` as
input and returns an object with two properties:

- `validForNewPackages` :: `Boolean`
- `validForOldPackages` :: `Boolean`

## Contents

- [Naming rules](#naming-rules)
- [Examples](#examples)
    + [Valid Names](#valid-names)
    + [Invalid Names](#invalid-names)
- [Tests](#tests)
- [License](#license)

## Naming Rules

Below is a list of rules that valid `npm` package name should conform to.

- package name length should be greater than zero
- all the characters in the package name must be lowercase i.e., no uppercase or mixed case names are allowed
- package name *can* consist of hyphens
- package name must *not* contain any non-url-safe characters (since name ends up being part of a URL)
- package name should not start with `.` or `_`
- package name should *not* contain any spaces
- package name should *not* contain any of the following characters: `~)('!*`
- package name *cannot* be the same as a node.js/io.js core module nor a reserved/blacklisted name. For example, the following names are invalid:
    + http
    + stream
    + node_modules
    + favicon.ico
- package name length cannot exceed 214


## Examples

### Valid Names

```js
var validate = require("validate-npm-package-name")

validate("some-package")
validate("example.com")
validate("under_score")
validate("123numeric")
validate("@npm/thingy")
validate("@jane/foo.js")
```

All of the above names are valid, so you'll get this object back:

```js
{
  validForNewPackages: true,
  validForOldPackages: true
}
```

### Invalid Names

```js
validate("excited!")
validate(" leading-space:and:weirdchars")
```

That was never a valid package name, so you get this:

```js
{
  validForNewPackages: false,
  validForOldPackages: false,
  errors: [
    'name cannot contain leading or trailing spaces',
    'name can only contain URL-friendly characters'
  ]
}
```

## Tests

```sh
npm install
npm test
```

## License

ISC
