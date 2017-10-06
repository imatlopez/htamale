# Htamale

## Easy to use tool for HTML templating and parsing.
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fimatlopez%2Fhtamale.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fimatlopez%2Fhtamale?ref=badge_shield)
[![Build Status](https://travis-ci.org/imatlopez/htamale.svg?branch=master)](https://travis-ci.org/imatlopez/htamale)
[![Coverage Status](https://coveralls.io/repos/github/imatlopez/htamale/badge.svg?branch=master)](https://coveralls.io/github/imatlopez/htamale?branch=master)

---

```js
const htamale = require('htamale');

const src = '<h2 class="title" ht-target="hello"></h2>');
const cfg = { hello: "Hello, world!" }

htamale(src, cfg)
//=> <h2 class="title">Hello, world!</h2>
```

## Installation
`npm install --save-dev htamale`

## API

### Components
Components are defined by the type field.

#### Datetime Object
Mandatory | Optional | Dynamic
--- | --- | ---
`type`: String | `format`: [See Momentum.js](https://momentjs.com/docs/#/get-set/set/) | `none`

Other Formats | Description
--- | --- | ---
`gen1` | Will output `MMMM YYYY` or `YYYY` if month is not given
`gen2` | Will output `MMM YYYY` or `YYYY` if month is not given
##### Example
```json
{
    "type": "datetime",
    "format": "YYYY-MM-DD",
    "year": 2016,
    "month": 10,
    "date": 9
}
```

#### Interval Object
Mandatory | Optional | Dynamic
--- | --- | ---
`type`: String | `` | `start`: Component
`` | `` | `end`: Component
`` | `` | `delim`: Component
##### Example
```json
{
    "type": "interval",
    "delim": " - ",
    "start": { ... },
    "end": { ... }
}
```

#### HTML Object
Mandatory | Optional | Dynamic
--- | --- | ---
`type`: String | `class`: String[] | `html`: Component
`` | `attr`: Map | ``
##### Example
```json
{
    "type": "html",
    "tag": "p",
    "class": [
        "foo",
        "bar"
    ],
    "attr": { "id": "text" },
    "html": "Hello, world!"
}
```
### HTML Properties

#### ht-target
This is the primary property to put in the markup. In the given example `p` will be filled with what the configuration file indicates.
```html
<p ht-target="foo.bar.baz"></p>
```

#### ht-append
With this property, the parser will write on top of the element instead of inside it. 
```html
<p ht-target="foo" ht-append></p>
```

### Configuration
The configuration file `.htamalerc` is written in JSON, to be used in the CLI although the module itself takes a JavaScript object.
#### Properties
Properties are defined as keys with either values or other tags
```json
{
    "foo": "bar",
    "foo2": {
        "foo3": "baz"
    }
}
```

#### Arrays
Arrays will clone a given element and duplicate if appending or write duplicates with the given values.

*Arrays may not contain objects with properties, only values.*
```json
{
    "foo": [
        { ... },
        { ... },
        { ... }
    ]
}
```

### CLI
The CLI can receive input from a pipe when given "`-`" as the last argument or load a file. It can then output to the console, piped to a file, or saved to a file using the outfile flag.
```
Usage: htamale [options] <file ...>


  Options:

    -V, --version             output the version number
    -r, --replace             Write output in-place, replacing input
    -o, --outfile [file,...]  Write output to files in order
    -c, --config [file]       Path to config file
    -q, --quiet               Suppress logging to stdout
    -h, --help                output usage information
```
