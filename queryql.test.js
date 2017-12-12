const QueryQl = require('./queryql');

test('allowed filters', () => {
    var queryql = new QueryQl();

    expect(queryql.allowed()).toEqual([
        'filtering',
        'filtering_or',
        'printing',
        'rel',
        'sorting',
    ]);
});
