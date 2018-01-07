function Combinators () {
    const COMBINATORS_AND = 'and';
    const COMBINATORS_DEFAULT = 'filtering';
    const COMBINATORS_FILTERING_OR = 'filtering_or';
    const COMBINATORS_OR = 'or';

    this.getCombinators = function () {
        return [
            COMBINATORS_AND,
            COMBINATORS_DEFAULT,
            COMBINATORS_FILTERING_OR,
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
                if (this.containsEmbedded(filter)) {
                    splitted.shift(); // remove the first
                }

                rel += (rel != '')
                    ?  ',' + splitted.join()
                    : 'rel=' + splitted.join(); 
            }

            if (qs != '') {
                qs += '&';
            }
            
            qs += this.combine + '['
                + this.getFilterIndex(filter)
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

    this.getFilterIndex = function (filter) {
        if (!this.containsEmbedded(filter) && this.containsRelations(filter)) {
            return '_embedded.'+ filter.field;
        }

        return filter.field;
    }

    this.containsRelations = function (filter) { 
        return filter.field.indexOf('.') !== -1;
    };

    this.containsEmbedded = function (filter) { 
        return filter.field.indexOf('_embedded') === 0;
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

    this.containsCombinator = function (jsonQuery) {
        for (i in jsonQuery) {
            if ('object' == typeof jsonQuery[i]) {
                return true;
            }
        }

        return false;
    }

    this.detectCombinator = function (jsonQuery) {
        for (i in jsonQuery) {
            if ('object' == typeof jsonQuery[i]) {
                return i;
            }
        }

        return false;
    }

    this.keepDefaultCombinator = function () {
        return this;
    }

    this.keepOrFilteringCombinator = function () {
        this.setCombinator('filtering_or');
        return this;
    }

    this.json = function (jsonQuery) {
        var fields = jsonQuery;

        if (this.containsCombinator(jsonQuery)) {
            var combinator = this.detectCombinator(jsonQuery)
            this.setCombinator(combinator);
            fields = jsonQuery[combinator];
        }

        for (i in fields) {
            this.applyFilter({ field: i, value: fields[i] });
        }
    }
}

global.module = global.module || {};

(module || {}).exports = QueryQl;

