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

function QueryStringBuilder () {
    this.filters = [];

    var combinators = new Combinators();

    this.combinators = combinators.getCombinators();

    this.combine = combinators.getDefaultCombinator();

    this.ensureHaveValidCombinator = function ()
    {
        if (!this.combinators.includes(this.getCombinator())) {
            throw new Error('combinator ' + this.getCombinator() + ' is not available');
        }

        return this;
    }

    this.setCombinator = function (combinator) {
        this.combine = combinator;

        return this;
    };

    this.getCombinator = function () {
        return this.combine;
    };

    this.setFilters = function (filters) {
        this.filters = filters;

        return this;
    };

    this.build = function () {
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

    this.containsRelations = function (filter) { 
        return filter.field.indexOf('_embedded') !== -1;
    };
}

function FilterManager() {
    this.filters = [];
    this.push = function (filter) {
        this.filters.push(filter);
    };
    this.getFilters = function () {
        return this.filters;
    };
    this.getFilter = function (index) {
        return this.filters[index];
    }
    this.getFields = function () {
        var filters = [];
        for (f in this.getFilters()) {
            filters.push(this.getFilter(f).field);
        }
        return filters;
    }
}

function QueryQl() {
    const relation = 1;    

    this.setCombinator = function (combinator) {
        this.builder.setCombinator(combinator);
        return this;
    };

    this.builder = new QueryStringBuilder();

    this.filterManager = new FilterManager();

    this.rel = [];

    this.applyFilter = function (filter) {
        this.filterManager
            .push(filter);
    };

    this.getRels = function () {
        this.rel = [];
        for (f in this.filterManager.getFilters()) {
            var filter = this.filterManager.getFilter(f);
            if (this.builder.containsRelations(filter)) {
                filterRelation = filter.field.split('.')[relation];
                this.rel.push(filterRelation);
            }
        }
        return this.rel;
    };

    this.getQueryString = function () {
        return this.builder
            .ensureHaveValidCombinator()
            .setFilters(this.filterManager.getFilters())
            .build();
    };

    this.getFilters = function () {
        return this.filterManager
            .getFields();
    };
}

window.module = window.module || {};

(module || {}).exports = QueryQl;

