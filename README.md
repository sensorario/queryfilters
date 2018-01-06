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
    qql.json({
        'and': {
            'foo': 'bar',
            'pippo': 'pluto'
        }
    });
    // and[foo]=bar&and[pippo]=pluto
    var query = qql.getQueryString();
</script>
```

## Examples

 * [an example with vue](doc/examples/vue.md)
 * [a json Query example with vue](doc/examples/vue-with-json.md)
 * [pure javascript example](doc/examples/javascript.md)
 * [query api with json](doc/examples/json.md)
