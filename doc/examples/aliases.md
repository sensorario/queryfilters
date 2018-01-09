# Old style queries using aliases

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

But it is possible to force old style queries.

```javascript
var jsonQuery = {
    'relation.nick': '@sensorario',
    'foo.bar.name': 'Simone'
};
var query = new QueryQl()
query.and(jsonQuery, {oldStyle:true});
```

This configuration will generate the following query.

```javascript
'rel=relation,foo,bar'
+ '&filtering[_embedded.relation.nick]=@sensorario'
+ '&filtering[_embedded.foo.bar.name]=Simone'
```
