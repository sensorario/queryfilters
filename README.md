queryfilters
============

[![Build Status](https://travis-ci.org/sensorario/queryfilters.svg?branch=master)](https://travis-ci.org/sensorario/queryfilters) [![npm version](https://badge.fury.io/js/queryfilters.svg)](https://badge.fury.io/js/queryfilters)

 * https://www.npmjs.com/package/queryfilters

Install
-------

Install via npm

```bash
$ npm install queryfilters
```

Include in your web application

```html
<script src="node_modules/queryfilters/queryql/dist/queryql-min.js"></script>
<script language="javascript">
    var qql = new QueryQl();
    qql.and({
        'foo': 'bar',
        'fizz.buzz': 'pluto'
    });
    // and[foo]=bar&and[_embedded.fizz.buzz]=pluto
    var query = qql.getQueryString();
</script>
```

Examples
--------

 * [a json Query example with vue](doc/examples/vue-with-json.md)
 * [an example with vue](doc/examples/vue.md)
 * [apply operator more times](doc/examples/operators.md)
 * [date ranges](doc/examples/dates.md)
 * [limit](doc/examples/limit.md)
 * [old style conf](doc/examples/oldstyle.md)
 * [period](doc/examples/period.md)
 * [pure javascript example](doc/examples/javascript.md)
 * [query api with json](doc/examples/json.md)
 * [skip rels](doc/examples/skiprel.md)
 * [sorting](doc/examples/sorting.md)
 * [store queries](doc/examples/store.md)
 * [using aliases](doc/examples/aliases.md)
 * [wrap combinators](doc/examples/combinators.md)
