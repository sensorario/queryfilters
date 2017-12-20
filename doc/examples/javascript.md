```javascript
var queryQl = new QueryQl()
queryQl.applyFilter({ field: '_embedded.relation.nick', value: '@sensorario' });
queryQl.applyFilter({ field: '_embedded.foo.bar.name', value: 'Simone' });
var querystring = queryQl.getQueryString();
```

`querystring` will contains:

    rel=relation,foo,bar&filtering[_embedded.relation.nick]=@sensorario&filtering[_embedded.foo.bar.name]=Simone
