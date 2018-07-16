# Queries using aliases

Instead of use `filtering` it is possible to use `and`.

```javascript
var jsonQuery = {
    'relation.nick': '@sensorario',
    'foo.bar.name': 'Simone'
};
var query = new QueryQl()
query.and(jsonQuery);
```

The query generate following:

```javascript
'rel=relation,foo,bar'
+ '&and[_embedded.relation.nick]=@sensorario'
+ '&and[_embedded.foo.bar.name]=Simone'
```

This configuration will generate the following query.

```javascript
'rel=relation,foo,bar'
+ '&filtering[_embedded.relation.nick]=@sensorario'
+ '&filtering[_embedded.foo.bar.name]=Simone'
```
