const QueryQl = require('./../lib/queryql');

test('sort fields', () => {
    var queryQl = new QueryQl()

    queryQl.and({'relation.nick|contains': ['senso', 'rario']}, {oldStyle:true});
    queryQl.sort({'relation.nick': 'asc'});

    expect(queryQl.getQueryString()).toEqual(
        'rel=relation'
        + '&filtering[_embedded.relation.nick|contains|1]=senso'
        + '&filtering[_embedded.relation.nick|contains|2]=rario'
        + '&sorting[_embedded.relation.nick]=asc'
    );
});

test('sort and ', () => {
    var queryQl = new QueryQl()

    var result = queryQl.build({
        query: {
            filtering: {
                'relation.nick|contains': ['senso', 'rario']
            }
        },
        sort: {
            'relation.nick': 'asc'
        }
    });

    expect(result).toEqual(
        'rel=relation'
        + '&filtering[_embedded.relation.nick|contains|1]=senso'
        + '&filtering[_embedded.relation.nick|contains|2]=rario'
        + '&sorting[_embedded.relation.nick]=asc'
    );
});
