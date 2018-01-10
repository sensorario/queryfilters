const QueryQl = require('./../lib/queryql');

test('store queries with name', () => {
    var queryQl = new QueryQl()

    queryQl.store({
        'filtering': {
            'relation.nick': 'sensorario',
        }
    }, 'findFoo');

    queryQl.store({
        'filtering': {
            'relation.nick|contains': ['senso', 'rario'],
        }
    }, 'findSensorario');

    expect(queryQl.getStoredQuery('findSensorario')).toEqual(
        'rel=relation'
        + '&filtering[_embedded.relation.nick|contains|1]=senso'
        + '&filtering[_embedded.relation.nick|contains|2]=rario'
    );

    expect(queryQl.getStoredQuery('findFoo')).toEqual(
        'rel=relation&filtering[_embedded.relation.nick]=sensorario'
    );
});

test('store parametrized queries', () => {
    var queryQl = new QueryQl()

    queryQl.store({
        'filtering': {
            'relation.nick': '##nickname##'
        }
    }, 'findUserByUsername', 'nickname');

    expect(queryQl.getQueryParameter('findUserByUsername')).toEqual(
        'nickname'
    );

    expect(queryQl.getRawQuery('findUserByUsername')).toEqual(
        'rel=relation&filtering[_embedded.relation.nick]=##nickname##'
    );

    expect(queryQl.getFinalQuery('findUserByUsername', 'simone')).toEqual(
        'rel=relation&filtering[_embedded.relation.nick]=simone'
    );
});
