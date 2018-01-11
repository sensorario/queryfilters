# Store

## Store queries with name

It is possible to store queries with an alias, thus is easy to remember the
query to do.

```javascript
queryQl.store({
    'filtering': {
        'relation.nick|contains': ['senso', 'rario'],
    }
}, 'findSensorario');
```

Query is stored with alias findSensorario, this can be retrieved just
remembering the semantic alias name.

```javascript
queryQl.getStoredQuery('findSensorario');
```

Returned query string is the following.

```javascript
'rel=relation'
+ '&filtering[_embedded.relation.nick|contains|1]=senso'
+ '&filtering[_embedded.relation.nick|contains|2]=rario'
```

## Store parametrized

In some cases is useless to store all possible queries. This for example the use
case "find user with nickname 'foo'". In these case is possible to store a
parametrized query in this way.

```javascript
queryQl.store({
    'filtering': {
        'relation.field': '##fieldname##'
    }
}, 'findByValue', 'fieldname');
```
As you can see is it possible sto store the query, assign an alias and a name
for the parameter. Is also possibile to build the parameter query using the
method `getFinalQuery` with alias and the parameter value.

```javascript
queryQl.getFinalQuery('findByValue', '42')
```

Returned query string is the following.

```javascript
'rel=relation&filtering[_embedded.relation.field]=42'
```
