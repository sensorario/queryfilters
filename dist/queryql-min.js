"use strict";function Combinators(){var t="filtering";this.getCombinators=function(){return["and",t,"filtering_or","or"]},this.getDefaultCombinator=function(){return t}}function QueryStringBuilder(){this.filters=[],this.sorters=[];var t=new Combinators;this.combinators=t.getCombinators(),this.combine=t.getDefaultCombinator(),this.ensureHaveValidCombinator=function(){if(!this.combinators.includes(this.getCombinator()))throw new Error("combinator "+this.getCombinator()+" is not available");return this},this.setCombinator=function(t){return this.combine=t,this},this.getCombinator=function(){return this.combine},this.setSorters=function(t){return this.sorters=t,this},this.setFilters=function(t){return this.filters=t,this},this.build=function(){var t="",i="",e=Object.keys(this.filters),r=0,n=0,s=[],o=[],a=[];for(n=e.length;r<n;r+=1){if(s=this.filters[e[r]],this.containsRelations(s)){(o=s.field.split(".")).pop(),this.containsEmbedded(s)&&o.shift();var h=o.join();0==a.includes(h)&&(i+=""!=i?","+h:"rel="+h),a.push(h)}""!=t&&(t+="&"),t+=this.combine+"["+this.getFilterIndex(s)+"]="+s.value}for(var u in this.sorters){var l=this.sorters[u];t+="&sorting["+this.getFilterIndex(l)+"]="+l.value}var f="";return""!=i&&""!=t&&(f="&"),i+f+t},this.getFilterIndex=function(t){return!this.containsEmbedded(t)&&this.containsRelations(t)?"_embedded."+t.field:t.field},this.containsRelations=function(t){return-1!==t.field.indexOf(".")},this.containsEmbedded=function(t){return 0===t.field.indexOf("_embedded")}}function SortingManager(){this.sorters=[],this.push=function(t){this.sorters.push(t)},this.getSorters=function(){return this.sorters}}function FilterManager(){this.filters=[],this.reset=function(){this.filters=[]},this.push=function(t){this.filters.push(t)},this.getFilters=function(){return this.filters},this.getFilter=function(t){return this.filters[t]},this.getFields=function(){var t=[],i=0,e=0,r=Object.keys(this.getFilters());for(e=r.length;i<e;i+=1)t.push(this.getFilter(r[i]).field);return t}}function QueryQl(){this.setCombinator=function(t){return this.builder.setCombinator(t),this},this.builder=new QueryStringBuilder,this.filterManager=new FilterManager,this.sortingManager=new SortingManager,this.rel=[],this.applySorting=function(t){this.sortingManager.push(t)},this.applyFilter=function(t){this.filterManager.push(t)},this.getRels=function(){this.rel=[];for(var t in this.filterManager.getFilters()){var i=this.filterManager.getFilter(t);if(this.builder.containsRelations(i)){var e=i.field.split(".")[1];this.rel.push(e)}}return this.rel},this.getQueryString=function(){return this.builder.ensureHaveValidCombinator().setFilters(this.filterManager.getFilters()).setSorters(this.sortingManager.getSorters()).build()},this.getFilters=function(){return this.filterManager.getFields()},this.containsCombinator=function(t){for(var i in t)if("object"==typeof t[i])return!0;return!1},this.detectCombinator=function(t){for(var i in t)if("object"==typeof t[i])return i;return!1},this.keepDefaultCombinator=function(){return this},this.keepOrFilteringCombinator=function(){return this.setCombinator("filtering_or"),this},this.json=function(t){var i=this.buildFieldsWithRightCombinator(t);for(var e in i)if("object"==typeof i[e]){var r=1;for(var n in i[e]){var s=e+"|"+r,o=i[e][n];r+=1,this.applyFilter({field:s,value:o})}}else this.applyFilter({field:e,value:i[e]})},this.sort=function(t){for(var i in t)this.applySorting({field:i,value:t[i]})},this.buildFieldsWithRightCombinator=function(t){var i=t;if(this.containsCombinator(t)){var e=this.detectCombinator(t);this.setCombinator(e),i=t[e]}return i},this.parseRawField=function(t){var i=t.split("|"),e=i[1];if(-1!=["list","eq"].indexOf(e))return{field:i[0],operator:e};if(void 0===e)return{field:i[0],operator:"eq"};throw new Error("operator "+e+" is not supported")},this.getFieldOperator=function(t){for(var i in this.filterManager.getFilters())if(-1!=this.filterManager.getFilters()[i].field.indexOf(t)){var e=this.parseRawField(this.filterManager.getFilters()[i].field);return"string"==typeof e.operator?e.operator:"eq"}},this.or=function(t,i){"object"!=typeof i||1!=i.oldStyle?this.json({or:t}):this.json({filtering_or:t})},this.and=function(t,i){"object"!=typeof i||1!=i.oldStyle?this.json({and:t}):this.json({filtering:t})},this.andFiltering=function(t){var i={filtering:t};this.json(i)},this.orFiltering=function(t){var i={filtering_or:t};this.json(i)},this.storedQueries=[],this.store=function(t,i,e){this.storedQueries[i]={query:t,parameter:e}},this.getStoredQuery=function(t){return this.filterManager.reset(),this.json(this.storedQueries[t].query),this.getQueryString()},this.getQueryParameter=function(t){return this.storedQueries[t].parameter},this.getRawQuery=function(t){return this.getStoredQuery(t)},this.getFinalQuery=function(t,i){return this.getRawQuery(t).replace("##"+this.getQueryParameter(t)+"##",i)},this.build=function(t){return this.json(t.query),this.sort(t.sort),this.getQueryString()}}global.module=global.module||{},(module||{}).exports=QueryQl;