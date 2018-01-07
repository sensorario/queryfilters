const QueryQl = require('./../lib/queryql');

test('detect field from raw field', () => {
    var queryQl = new QueryQl()
    var parsedRow = queryQl.parseRawField('foo|eq');
    expect(parsedRow.field).toEqual('foo');
});

test('detect operator from raw field', () => {
    var queryQl = new QueryQl()
    var parsedRow = queryQl.parseRawField('foo|eq');
    expect(parsedRow.operator).toEqual('eq');
});

test('detect fields operators', () => {
    var jsonQuery = {
        'or': {
            'relation.nick|list': '@sensorario'
        }
    };
    var queryQl = new QueryQl()
    queryQl.json(jsonQuery);
    expect(queryQl.getFieldOperator('relation.nick')).toEqual('list');
});

test('default operator is eq whenever not defined', () => {
    var jsonQuery = {
        'or': {
            'relation.nick': '@sensorario'
        }
    };
    var queryQl = new QueryQl()
    queryQl.json(jsonQuery);
    expect(queryQl.getFieldOperator('relation.nick')).toEqual('eq');
});

test('detect invalid operators', () => {
    var jsonQuery = {
        'or': {
            'relation.nick|invalid': '@sensorario'
        }
    };
    var queryQl = new QueryQl()
    var catched = false;
    try {
        queryQl.parseRawField('field|invalid');
    } catch(e) {
        catched = true;
    }
    expect(catched).toEqual(true);
});
