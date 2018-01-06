# Query api with json

To build a complicated query like this.

```
'rel=relation,foo,bar'
+ '&filtering[_embedded.relation.nick]=@sensorario'
+ '&filtering[_embedded.foo.bar.name]=Simone'
```

It is possibile to send to `json()` method an object:

```javascript
var jsonQuery = {
  '_embedded.relation.nick': '@sensorario',
  '_embedded.foo.bar.name': 'Simone'
};
var queryQl = new QueryQl()
queryQl.json(jsonQuery);
```
## Change default operator

It is also possibile to change the default operator wrapping each fields inside
the operator.

```
'rel=relation,foo,bar'
+ '&or[_embedded.relation.nick]=@sensorario'
+ '&or[_embedded.foo.bar.name]=Simone'
```

```javascript
var jsonQuery = {
  'or': {
    '_embedded.relation.nick': '@sensorario',
    '_embedded.foo.bar.name': 'Simone'
  }
};
```
