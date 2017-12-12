function QueryQl() {
    const relation = 1;    

    this.filters = [];
    this.rel = [];

    this.applyFilter = function (filter) {
        this.filters.push(filter);
    };

    this.getRels = function () {
        this.rel = [];
        for (f in this.filters) {
            var filter = this.filters[f];
            if (this.containsRelations(filter)) {
                filterRelation = filter.field.split('.')[relation];
                this.rel.push(filterRelation);
            }
        }
        return this.rel;
    };

    this.getQueryString = function () {
        var qs = '';
        for (f in this.filters) {
            var filter = this.filters[f];
            if (this.containsRelations(filter)) {
                filterRelation = filter.field.split('.')[relation];
                qs += 'rel=' + filterRelation;
            }

            if (qs != '') {
                qs += '&';
            }

            qs += 'filtering['
                + filter.field
                + ']='
                + filter.value
            ;
        }
        return qs;
    };

    this.getFilters = function () {
        var filters = [];
        for (f in this.filters) {
            filters.push(this.filters[f].field);
        }
        return filters;
    };

    this.containsRelations = function (filter) { 
        return filter.field.indexOf('_embedded') !== -1;
    };
}

module.exports = QueryQl;
