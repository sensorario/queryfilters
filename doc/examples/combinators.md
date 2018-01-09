# Wrap Combinators

## Use aliases method to auto select combinator

Is possible to use these aliases to omit operator frmo jsonQuery.

 - `.or`
 - `.and`
 - `.orFiltering`
 - `.andFiltering`

```javascript
var jsonQuery = {
    'relation.nick': '@sensorario',
    'foo.bar.name': 'Simone'
};
var query = new QueryQl()
query.orFiltering(jsonQuery);
```

The query generated is the following:

```javascript
'rel=relation,foo,bar'
+ '&filtering_or[_embedded.relation.nick]=@sensorario'
+ '&filtering_or[_embedded.foo.bar.name]=Simone'
```
