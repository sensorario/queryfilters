const QueryQl = require('./../lib/queryql');

test('query data between values', () => {
    var queryQl = new QueryQl()

    queryQl.between({
        what: 'field_data',
        from: '2017-01-02',
        to: '2017-02-03'
    });

    expect(queryQl.getQueryString()).toEqual(
        'filtering[field_data|gte]=2017-01-02'
        + '&filtering[field_data|lte]=2017-02-03'
    );
});

test('query data between values wirth or operator', () => {
    var queryQl = new QueryQl()

    queryQl.between({
        what: 'field_data',
        from: '2017-01-02',
        to: '2017-02-03'
    }, 'or');

    expect(queryQl.getQueryString()).toEqual(
        'filtering_or[field_data|gte]=2017-01-02'
        + '&filtering_or[field_data|lte]=2017-02-03'
    );
});

// todo check sull'operatore
// eccezione in caso di operatore sbagliato
