# Periods

Instead of send date, it is possibile to query for "current week".

```javascript
queryQl.currentWeek({
    what: 'field_data',
});
```

The result is ...

```javascript
'filtering[field_data|gte]=2017-01-02'
+ '&filtering[field_data|lte]=2017-02-03'
```

Internally uses between method, except for the definition of "from" and "to"
options.
