# Operators

If for some reasons a filter must be applied more times, it is possibile to
define the value to check as an array of items. Automatically queryfilter split
the query in more items. To distinguish each item it apply a value after the
filter and the operator.

```javascript
var jsonQuery = {
    'relation.nick|contains': ['senso', 'rario'],
};
var queryQl = new QueryQl()
queryQl.andFiltering(jsonQuery);
```

The result is the following query that apply same operator to same field but
with different values.

```javascript
'rel=relation'
+ '&filtering[_embedded.relation.nick|contains|1]=senso'
+ '&filtering[_embedded.relation.nick|contains|2]=rario'
```
