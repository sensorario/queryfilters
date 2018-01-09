const QueryQl = require('./../lib/queryql');

test('accept json as query', () => {
    var jsonQuery = {
        '_embedded.relation.nick': '@sensorario',
        '_embedded.foo.bar.name': 'Simone'
    };
    var queryQl = new QueryQl()
    queryQl.json(jsonQuery);
    expect(queryQl.getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&filtering[_embedded.relation.nick]=@sensorario'
        + '&filtering[_embedded.foo.bar.name]=Simone'
    );
});

test('accept combinator as root element of jsonQuery', () => {
    var jsonQuery = {
        'or': {
            '_embedded.relation.nick': '@sensorario',
            '_embedded.foo.bar.name': 'Simone'
        }
    };
    var queryQl = new QueryQl()
    expect(queryQl.containsCombinator(jsonQuery)).toEqual(true);
});

test('detect combinator', () => {
    var jsonQuery = {
        'or': {
            '_embedded.relation.nick': '@sensorario',
            '_embedded.foo.bar.name': 'Simone'
        }
    };
    var queryQl = new QueryQl()
    expect(queryQl.detectCombinator(jsonQuery)).toEqual('or');
});

test('accept json as query', () => {
    var jsonQuery = {
        'or': {
            '_embedded.relation.nick': '@sensorario',
            '_embedded.foo.bar.name': 'Simone'
        }
    };
    var queryQl = new QueryQl()
    queryQl.json(jsonQuery);
    expect(queryQl.getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&or[_embedded.relation.nick]=@sensorario'
        + '&or[_embedded.foo.bar.name]=Simone'
    );
});

test('query al fields with or using or() alias', () => {
    var jsonQuery = {
        'relation.nick': '@sensorario',
        'foo.bar.name': 'Simone'
    };
    var queryQl = new QueryQl()
    queryQl.or(jsonQuery);
    expect(queryQl.getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&or[_embedded.relation.nick]=@sensorario'
        + '&or[_embedded.foo.bar.name]=Simone'
    );
});

test('query all fields with and using and() alias', () => {
    var jsonQuery = {
        'relation.nick': '@sensorario',
        'foo.bar.name': 'Simone'
    };
    var queryQl = new QueryQl()
    queryQl.and(jsonQuery);
    expect(queryQl.getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&and[_embedded.relation.nick]=@sensorario'
        + '&and[_embedded.foo.bar.name]=Simone'
    );
});

test('query all fields with filtering using andFiltering() alias', () => {
    var jsonQuery = {
        'relation.nick': '@sensorario',
        'foo.bar.name': 'Simone'
    };
    var queryQl = new QueryQl()
    queryQl.andFiltering(jsonQuery);
    expect(queryQl.getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&filtering[_embedded.relation.nick]=@sensorario'
        + '&filtering[_embedded.foo.bar.name]=Simone'
    );
});

test('query all fields with filtering_or using orFiltering() alias', () => {
    var jsonQuery = {
        'relation.nick': '@sensorario',
        'foo.bar.name': 'Simone'
    };
    var queryQl = new QueryQl()
    queryQl.orFiltering(jsonQuery);
    expect(queryQl.getQueryString()).toEqual(
        'rel=relation,foo,bar'
        + '&filtering_or[_embedded.relation.nick]=@sensorario'
        + '&filtering_or[_embedded.foo.bar.name]=Simone'
    );
});
