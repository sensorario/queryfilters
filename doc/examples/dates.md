# Query by date ranges

It is possible to filter between dates.

```javascript
queryQl.between({
    what: 'field_data',
    from: '2017-01-02',
    to: '2017-02-03'
});
```

The result is ...

```javascript
'filtering[field_data|gte]=2017-01-02'
+ '&filtering[field_data|lte]=2017-02-03'
```
