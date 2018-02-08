const QueryQl = require('./../lib/queryql');

describe('negative limit is converted to a bit integer value', () => {
    test('limit is added to the end of query string', () => {
        var queryQl = new QueryQl()
        queryQl.restriction({limit:-1});
        expect(queryQl.getQueryString()).toEqual('limit=99999');
    });

    test('& character is added only when query string is not empty', () => {
        var queryQl = new QueryQl()
        queryQl.json({
            'foo': 'bar',
        });
        queryQl.restriction({limit:-1});
        expect(queryQl.getQueryString()).toEqual('filtering[foo]=bar&limit=99999');
    });
});
