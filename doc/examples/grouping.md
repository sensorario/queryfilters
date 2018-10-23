# Grouping

> to do ...

```node
  var jsonQuery = {
    'or': {
      'conditions': [{
        'role|contains': 'baz',
        'group|contains': 'baz',
      },{
        'name|eq': 'Simone',
        'surname|eq': 'Gentili',
      }]
    }
  }
  
  var queryQl = new QueryQl({oldStyle:true})
  
  queryQl.json(jsonQuery);
  
  expect(queryQl.getQueryString()).toEqual(
    'filtering_or[role|contains|0]=baz&' +
    'filtering_or[group|contains|0]=baz&' +
    'filtering_or[name|eq|1]=Simone&' +
    'filtering_or[surname|eq|1]=Gentili'
  );
```
