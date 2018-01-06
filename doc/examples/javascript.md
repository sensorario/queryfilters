# Example

## With applyFilter methods

```javascript
var queryQl = new QueryQl()
queryQl.applyFilter({ field: '_embedded.relation.nick', value: '@sensorario' });
queryQl.applyFilter({ field: '_embedded.foo.bar.name', value: 'Simone' });
var querystring = queryQl.getQueryString();
```

## With json methods

```javascript
var queryQl = new QueryQl()
queryQl.json({
  '_embedded.relation.nick', '@sensorario',
  '_embedded.foo.bar.name', 'Simone'
});
var querystring = queryQl.getQueryString();
```

## Result

`querystring` will contains:

    rel=relation,foo,bar&filtering[_embedded.relation.nick]=@sensorario&filtering[_embedded.foo.bar.name]=Simone
