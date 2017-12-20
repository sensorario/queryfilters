function QueryQl() {
    const relation = 1;    

    this.filters = [];

    this.combine = 'filtering';

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

    this.getQueryString = function (combinator = null) {
        var qs = '';
        var rel = '';

        if (combinator) {
            this.combine = combinator;
        }

        for (f in this.filters) {
            var filter = this.filters[f];

            if (this.containsRelations(filter)) {
                splitted = filter.field.split('.')
                splitted.pop(); // remove the last
                splitted.shift(); // remove the first

                rel += (rel != '')
                    ?  ',' + splitted.join()
                    : 'rel=' + splitted.join(); 
            }

            if (qs != '') {
                qs += '&';
            }

            qs += this.combine + '['
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
