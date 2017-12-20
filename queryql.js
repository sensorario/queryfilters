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
        var rel = '';

        for (f in this.filters) {
            var filter = this.filters[f];

            if (this.containsRelations(filter)) {
                splitted = filter.field.split('.')
                splitted.pop(); // remove the last
                splitted.shift(); // remove the first
                if (rel != '') {
                    rel += ',' + splitted.join(); 
                } else {
                    rel += 'rel=' + splitted.join(); 
                }
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

        j = '';
        if (rel != '' && qs != '') {
            j = '&';
        }

        return rel + j + qs;
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
