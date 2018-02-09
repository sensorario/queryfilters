# Limits

Whenever page limit must be infinite, it is possibile to configure the query
with limit equals to -1. QueryQl convert it in a big integer number simulating
infinite limit.

```javascript
var queryQl = new QueryQl()
queryQl.restriction({limit:-1});
expect(queryQl.getQueryString()).toEqual('limit=99999');
```

It works also with filtering.

```javascript
var queryQl = new QueryQl()
queryQl.json({'foo': 'bar'});
queryQl.restriction({limit:-1});
expect(queryQl.getQueryString()).toEqual('filtering[foo]=bar&limit=99999');
```
