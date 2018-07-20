const QueryQl = require('./../lib/queryql');

test('clear all', () => {
  var queryQl = new QueryQl()
  queryQl.and({
    'foo': 'bar'
  });
  queryQl.clear();
  expect(queryQl.getQueryString()).toEqual('')
});
