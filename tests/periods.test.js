const giorno = require('giorno/lib/giorno')

const QueryQl = require('./../lib/queryql');

test('query data between values', () => {
  const queryQl = new QueryQl()

  const monday = giorno.monday();

  let sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);

  let year = sunday.getFullYear();
  let month = sunday.getMonth() + 1;
  let day = sunday.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  sunday = year + '-' + month + '-' + day

  queryQl.currentWeek({
    date: 'date_to_check',
  });

  expect(queryQl.getQueryString()).toEqual(
    'filtering[date_to_check|gte]=' + monday
    + '&filtering[date_to_check|lte]=' + sunday
  );
});
