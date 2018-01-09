# queryfilters

 * https://www.npmjs.com/package/queryfilters

## Install

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

## Examples

 * [a json Query example with vue](doc/examples/vue-with-json.md)
 * [an example with vue](doc/examples/vue.md)
 * [pure javascript example](doc/examples/javascript.md)
 * [query api with json](doc/examples/json.md)
 * [wrap combinators](doc/examples/combinators.md)
