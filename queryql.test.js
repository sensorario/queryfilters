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
