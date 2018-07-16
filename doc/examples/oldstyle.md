## Oldstyle

Instead of use `filtering` keyword is possibile to use new `and` methods and
force old style queries. This feature is available for sorting.

```javascript
var queryQl = new QueryQl()

queryQl.and({'relation.nick|contains': ['senso', 'rario']}, {oldStyle:true});
queryQl.sort({'relation.nick': 'asc'});

'rel=relation'
+ '&filtering[_embedded.relation.nick|contains|1]=senso'
+ '&filtering[_embedded.relation.nick|contains|2]=rario'
+ '&sorting[_embedded.relation.nick]=asc'
```

But it is possible to force old style queries at runtime.

```javascript
var jsonQuery = {
    'relation.nick': '@sensorario',
    'foo.bar.name': 'Simone'
};
var query = new QueryQl()
query.and(jsonQuery, {oldStyle:true});
```

For it is also possibile to force oldStyle directly with

> `new QueryQl({oldStyle:true})`

From first example:

```javascript
var queryQl = new QueryQl({oldStyle:true})

queryQl.and({'relation.nick|contains': ['senso', 'rario']});
queryQl.sort({'relation.nick': 'asc'});

'rel=relation'
+ '&filtering[_embedded.relation.nick|contains|1]=senso'
+ '&filtering[_embedded.relation.nick|contains|2]=rario'
+ '&sorting[_embedded.relation.nick]=asc'
```
