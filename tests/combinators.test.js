const QueryQl = require('./../lib/queryql');

test('apply filters with default operator', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({ field: '_embedded.relation.nick', value: '@sensorario' });
    queryQl.applyFilter({ field: '_embedded.foo.bar.name', value: 'Simone' });
    expect(queryQl.keepDefaultCombinator().getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&filtering[_embedded.relation.nick]=@sensorario'
        + '&filtering[_embedded.foo.bar.name]=Simone'
    );
});

test('apply filters with or filtering operator', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({ field: '_embedded.relation.nick', value: '@sensorario' });
    queryQl.applyFilter({ field: '_embedded.foo.bar.name', value: 'Simone' });
    expect(queryQl.keepOrFilteringCombinator().getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&filtering_or[_embedded.relation.nick]=@sensorario'
        + '&filtering_or[_embedded.foo.bar.name]=Simone'
    );
});

test('apply filters with or operator', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({ field: '_embedded.relation.nick', value: '@sensorario' });
    queryQl.applyFilter({ field: '_embedded.foo.bar.name', value: 'Simone' });
    expect(queryQl.setCombinator('or').getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&or[_embedded.relation.nick]=@sensorario'
        + '&or[_embedded.foo.bar.name]=Simone'
    );
});

test('apply filters with and operator', () => {
    var queryQl = new QueryQl()
    queryQl.applyFilter({ field: '_embedded.relation.nick', value: '@sensorario' });
    queryQl.applyFilter({ field: '_embedded.foo.bar.name', value: 'Simone' });
    expect(queryQl.setCombinator('and').getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&and[_embedded.relation.nick]=@sensorario'
        + '&and[_embedded.foo.bar.name]=Simone'
    );
});

test('accept limited list of combinator', () => {
    var queryQl = new QueryQl()
    var catched = false;

    try {
        queryQl.setCombinator('invalid').getQueryString()
    } catch (e) {
        catched = true;
    }

    expect(catched).toEqual(true);
});
