# Sorting

It is also available sorting feature.

```javascript
var queryQl = new QueryQl()

queryQl.and({'relation.nick|contains': ['senso', 'rario']}, {oldStyle:true});
queryQl.sort({'relation.nick': 'asc'});

'rel=relation'
+ '&filtering[_embedded.relation.nick|contains|1]=senso'
+ '&filtering[_embedded.relation.nick|contains|2]=rario'
+ '&sorting[_embedded.relation.nick]=asc'
```

Same result can be reached with `build` method that do the complete work:

 * filtering (and, or, …)
 * sorting

```javascript
var queryQl = new QueryQl()

var result = queryQl.build({
    query: {
        filtering: {
            'relation.nick|contains': ['senso', 'rario']
        }
    },
    sort: {
        relation.nick: 'asc'
    }
});
```
