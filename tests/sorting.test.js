const QueryQl = require('./../lib/queryql');

test.only('sort fields', () => {
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
