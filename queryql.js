function Combinators () {
    const COMBINATORS_AND = 'and';
    const COMBINATORS_DEFAULT = 'filtering';
    const COMBINATORS_OR = 'or';

    this.getCombinators = function () {
        return [
            COMBINATORS_AND,
            COMBINATORS_DEFAULT,
            COMBINATORS_OR
        ];
    }

    this.getDefaultCombinator = function () {
        return COMBINATORS_DEFAULT;
    };
}

function QueryQl() {
    const relation = 1;    

    combinators = new Combinators();

    this.combinators = combinators.getCombinators()

    this.combine = combinators.getDefaultCombinator();

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

    this.setCombinator = function (combinator) {
        this.combine = combinator;
        return this;
    };

    this.getQueryString = function () {
        if (!this.combinators.includes(this.combine)) {
            throw new Error('combinator ' + this.combine + ' is not available');
        }

        var qs = '';
        var rel = '';

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

window.module = window.module || {};

(module || {}).exports = QueryQl;

