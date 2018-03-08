# Skip rel

Not all relations should be present in querystring. This method provide a
solution to remove relations.

```javascript
var queryQl = new QueryQl()
queryQl.applyFilter({ field: '_embedded.relation.nick', value: '@sensorario' });
queryQl.applyFilter({ field: '_embedded.foo.bar.name', value: 'Simone' });
expect(queryQl.keepDefaultCombinator().getQueryString({
    skiprel: true
})).toEqual(
    'filtering[_embedded.relation.nick]=@sensorario'
    + '&filtering[_embedded.foo.bar.name]=Simone'
);
```

The query generate following:

```javascript
'&and[_embedded.relation.nick]=@sensorario'
+ '&and[_embedded.foo.bar.name]=Simone'
```
