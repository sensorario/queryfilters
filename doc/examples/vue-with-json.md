# Vue with json

This is a little example that helps to include queryfilters in a Vue project.

```javascript
<script src="https://unpkg.com/vue"></script>
<script src="node_modules/queryfilters/queryql/dist/queryql-min.js"></script>

<div id="app">
    <div>{{ json_query }}</div>
</div>

<script language="javascript">
    var json_query = new QueryQl();

    json_query.json({
        'and': {
            'foo': 'bar',
            'pippo': 'pluto'
        }
    });

    new Vue({
        el: '#app',
        data: {
            // and[foo]=bar&and[pippo]=pluto
            json_query: json_query.getQueryString()
        }
    })
</script>
```
