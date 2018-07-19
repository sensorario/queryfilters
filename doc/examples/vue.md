# Vue


This is a little example that helps to include queryfilters in a Vue project.

```javascript
<script src="https://unpkg.com/vue"></script>
<script src="node_modules/queryfilters/queryql/dist/queryql-min.js"></script>

<div id="app">
 <p>{{ message }}</p>
</div>

<script language="javascript">
   var q = new QueryQl();

   q.applyFilter({
       field: '_embedded.foo.bar',
       value: 'foo'
   });

   new Vue({
       el: '#app',
       data: {
           // rel=foo&filtering[_embedded.foo.bar]=foo
           message: q.getQueryString()
       }
   })
</script>
```

## Usage with a Vue plugin

If your project is created with [Vue CLI](https://cli.vuejs.org/) or it uses Webpack it's highly recommended to use [this Vue plugin](https://github.com/Huc91/VueQueryFilter) created by [Huc91](https://github.com/Huc91). It will simplify you life.
