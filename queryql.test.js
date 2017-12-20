const QueryQl = require('./queryql');

test('expose a list of filters', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({
        field: 'id',
        value: 42
    });
    expect(queryQl.getFilters()).toEqual([
        'id'
    ]);
});

test('check if filter contains relations', () => {
    var queryQl = new QueryQl()
    expect(queryQl.containsRelations({
        field: 'id',
        value: 42
    })).toBe(false);

    expect(queryQl.containsRelations({
        field: '_embedded.foo.bar',
        value: 42
    })).toBe(true);
});

test('build a query string with filtes', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({
        field: 'id',
        value: 42
    });
    expect(queryQl.getQueryString()).toEqual('filtering[id]=42');
});

test('extract rel from filter', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({
        field: '_embedded.fizz.bar',
        value: 666
    });
    expect(queryQl.getRels()).toEqual(['fizz']);
});

test('add rel with embedded filter', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({
        field: '_embedded.foo.bar',
        value: 666
    });
    expect(queryQl.getQueryString()).toEqual(
        'rel=foo&filtering[_embedded.foo.bar]=666'
    );
});

test('add rel with embedded filter even if have more levels', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({
        field: '_embedded.foo.bar.field',
        value: 666
    });
    expect(queryQl.getQueryString()).toEqual(
        'rel=foo,bar&filtering[_embedded.foo.bar.field]=666'
    );
});

test('add all rel from each filter', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({ field: '_embedded.relation.nick', value: '@sensorario' });
    queryQl.applyFilter({ field: '_embedded.foo.bar.name', value: 'Simone' });
    expect(queryQl.getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&filtering[_embedded.relation.nick]=@sensorario'
        + '&filtering[_embedded.foo.bar.name]=Simone'
    );
});

test('change combination operation', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({ field: '_embedded.relation.nick', value: '@sensorario' });
    queryQl.applyFilter({ field: '_embedded.foo.bar.name', value: 'Simone' });
    var operators = ['or', 'and'];
    for (i in operators) {
        expect(queryQl.getQueryString(operators[i])).toEqual(
            'rel=relation,foo,bar'
            + '&' + operators[i] + '[_embedded.relation.nick]=@sensorario'
            + '&' + operators[i] + '[_embedded.foo.bar.name]=Simone'
        );
    }
});
