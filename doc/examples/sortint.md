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
