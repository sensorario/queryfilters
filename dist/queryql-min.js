"use strict";const giorno=require("giorno/lib/giorno");function Combinators(){var t="filtering";this.getCombinators=function(){return["and",t,"filtering_or","or"]},this.getDefaultCombinator=function(){return t}}function QueryStringBuilder(){this.filters=[],this.sorters=[];var t=new Combinators;this.combinators=t.getCombinators(),this.combine=t.getDefaultCombinator(),this.ensureHaveValidCombinator=function(){if(!this.combinators.includes(this.getCombinator()))throw new Error("combinator "+this.getCombinator()+" is not available");return this},this.setCombinator=function(t){return this.combine=t,this},this.getCombinator=function(){return this.combine},this.setSorters=function(t){return this.sorters=t,this},this.setFilters=function(t){return this.filters=t,this},this.setRestrictions=function(t){return this.restrictions=t,this},this.build=function(t){var i="",e="",r=Object.keys(this.filters),n=0,s=0,o=[],h=[],a=[];for(s=r.length;n<s;n+=1){if(o=this.filters[r[n]],this.containsRelations(o)){(h=o.field.split(".")).pop(),this.containsEmbedded(o)&&h.shift();var u=h.join();0==a.includes(u)&&(e+=""!=e?","+u:"rel="+u),a.push(u)}""!=i&&(i+="&"),i+=this.combine+"["+this.getFilterIndex(o)+"]="+o.value}for(var l in this.sorters){var f=this.sorters[l];i+="&sorting["+this.getFilterIndex(f)+"]="+f.value}var g="";""!=e&&""!=i&&(g="&");var c="";return 0>this.restrictions.limit&&(""==e&&""==i||(c="&"),c+="limit=99999"),null!=t&&1==t.skiprel&&(e="",g=g.substring(1,g.length)),e+g+i+c},this.getFilterIndex=function(t){return!this.containsEmbedded(t)&&this.containsRelations(t)?"_embedded."+t.field:t.field},this.containsRelations=function(t){return-1!==t.field.indexOf(".")},this.containsEmbedded=function(t){return 0===t.field.indexOf("_embedded")}}function SortingManager(){this.sorters=[],this.push=function(t){this.sorters.push(t)},this.getSorters=function(){return this.sorters}}function FilterManager(){this.filters=[],this.reset=function(){this.filters=[]},this.push=function(t){this.filters.push(t)},this.getFilters=function(){return this.filters},this.getFilter=function(t){return this.filters[t]},this.getFields=function(){var t=[],i=0,e=0,r=Object.keys(this.getFilters());for(e=r.length;i<e;i+=1)t.push(this.getFilter(r[i]).field);return t}}function QueryQl(t){this.restrictionConfiguration={};this.setCombinator=function(t){return this.builder.setCombinator(t),this},this.builder=new QueryStringBuilder,this.filterManager=new FilterManager,this.sortingManager=new SortingManager,this.rel=[],this.applySorting=function(t){this.sortingManager.push(t)},this.applyFilter=function(t){this.filterManager.push(t)},this.applyFilters=function(t){const i=this.filterManager;t.forEach(function(t){i.push(t)})},this.getRels=function(){this.rel=[];for(var t in this.filterManager.getFilters()){var i=this.filterManager.getFilter(t);if(this.builder.containsRelations(i)){var e=i.field.split(".")[1];this.rel.push(e)}}return this.rel},this.getQueryString=function(t){return this.builder.ensureHaveValidCombinator().setFilters(this.filterManager.getFilters()).setSorters(this.sortingManager.getSorters()).setRestrictions(this.restrictionConfiguration).build(t)},this.getFilters=function(){return this.filterManager.getFields()},this.containsCombinator=function(t){for(var i in t)if("object"==typeof t[i])return!0;return!1},this.detectCombinator=function(t){for(var i in t)if("object"==typeof t[i])return i;return!1},this.keepDefaultCombinator=function(){return this},this.keepOrFilteringCombinator=function(){return this.setCombinator("filtering_or"),this},this.json=function(t){var i=this.buildFieldsWithRightCombinator(t);for(var e in i)if("object"==typeof i[e]){var r=1;for(var n in i[e]){var s=e+"|"+r,o=i[e][n];r+=1,this.applyFilter({field:s,value:o})}}else this.applyFilter({field:e,value:i[e]})},this.sort=function(t){for(var i in t)this.applySorting({field:i,value:t[i]})},this.buildFieldsWithRightCombinator=function(t){var i=t;if(this.containsCombinator(t)){var e=this.detectCombinator(t);this.setCombinator(e),i=t[e]}return i},this.parseRawField=function(t){var i=t.split("|"),e=i[1];if(-1!=["list","eq"].indexOf(e))return{field:i[0],operator:e};if(void 0===e)return{field:i[0],operator:"eq"};throw new Error("operator "+e+" is not supported")},this.getFieldOperator=function(t){for(var i in this.filterManager.getFilters())if(-1!=this.filterManager.getFilters()[i].field.indexOf(t)){var e=this.parseRawField(this.filterManager.getFilters()[i].field);return"string"==typeof e.operator?e.operator:"eq"}},this.or=function(t,i){"object"!=typeof i||1!=i.oldStyle?this.json({or:t}):this.json({filtering_or:t})},this.and=function(i,e){!("object"==typeof e&&1==e.oldStyle||void 0!==t&&1==t.oldStyle)?this.json({and:i}):this.json({filtering:i})},this.andFiltering=function(t){var i={filtering:t};this.json(i)},this.orFiltering=function(t){var i={filtering_or:t};this.json(i)},this.storedQueries=[],this.store=function(t,i,e){this.storedQueries[i]={query:t,parameter:e}},this.getStoredQuery=function(t){return this.filterManager.reset(),this.json(this.storedQueries[t].query),this.getQueryString()},this.getQueryParameter=function(t){return this.storedQueries[t].parameter},this.getRawQuery=function(t){return this.getStoredQuery(t)},this.getFinalQuery=function(t,i){return this.getRawQuery(t).replace("##"+this.getQueryParameter(t)+"##",i)},this.build=function(t){return this.json(t.query),this.sort(t.sort),this.getQueryString()},this.between=function(t,i){var e={};return e[t.what+"|gte"]=t.from,e[t.what+"|lte"]=t.to,void 0===i?this.andFiltering(e):"or"==i&&this.orFiltering(e),this.getQueryString()},this.restriction=function(t){this.restrictionConfiguration=t},this.clear=(()=>{this.filterManager.reset()}),this.currentWeek=function(t){const i=giorno.monday();let e=new Date(i);e.setDate(e.getDate()+6);let r=e.getMonth()+1;r<10&&(r="0"+r);let n=e.getDate();n<10&&(n="0"+n);const s=e.getFullYear()+"-"+r+"-"+n;return this.between({what:t.date,from:i,to:s})}}global.module=global.module||{},(module||{}).exports=QueryQl;