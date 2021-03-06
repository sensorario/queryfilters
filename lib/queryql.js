"use strict";

const giorno = require('giorno/lib/giorno')

function Combinators() {
  const COMBINATORS_AND = "and";
  const COMBINATORS_DEFAULT = "filtering";
  const COMBINATORS_FILTERING_OR = "filtering_or";
  const COMBINATORS_OR = "or";

  this.getCombinators = function () {
    return [
      COMBINATORS_AND,
      COMBINATORS_DEFAULT,
      COMBINATORS_FILTERING_OR,
      COMBINATORS_OR
    ];
  };

  this.getDefaultCombinator = function () {
    return COMBINATORS_DEFAULT;
  };
}

function QueryStringBuilder(options) {
  this.filters = [];

  this.sorters = [];

  const combinators = new Combinators();

  this.combinators = combinators.getCombinators();

  this.combine = combinators.getDefaultCombinator();

  this.ensureHaveValidCombinator = function () {
    if (!this.combinators.includes(this.getCombinator())) {
      throw new Error("combinator " + this.getCombinator() + " is not available");
    }
    return this;
  };

  this.setCombinator = function (combinator) {
    this.combine = combinator;
    return this;
  };

  this.getCombinator = function () {
    return this.combine;
  };

  this.setSorters = function (sorters) {
    this.sorters = sorters;
    return this;
  };

  this.setFilters = function (filters) {
    this.filters = filters;
    return this;
  };

  this.setRestrictions = function(restrictions) {
    this.restrictions = restrictions;
    return this;
  };

  this.build = function (opt) {
    let qs = "";
    let rel = "";
    const filterKeys = Object.keys(this.filters);
    let i = 0, l = 0, filter = [], splitted = [];
    const relationAdded = [];
    for (l = filterKeys.length; i < l; i += 1) {
      filter = this.filters[filterKeys[i]];

      if (this.containsRelations(filter)) {
        splitted = filter.field.split(".");
        splitted.pop();
        if (this.containsEmbedded(filter)) {
          splitted.shift();
        }

        const relationName =  splitted.join();

        if (false == relationAdded.includes(relationName)) {
          rel += (rel != "")
            ? "," + relationName
            : "rel=" + relationName;
        }

        relationAdded.push(relationName);
      }

      if (qs != "") {
        qs += "&";
      }

      if ("undefined" !== typeof options) {
        if (this.combine === "or" && options.oldStyle === true) {
          this.combine = "filtering_or";
        }
      }

      qs += this.combine + "["
        + this.getFilterIndex(filter)
        + "]="
        + filter.value
      ;
    }

    for (const s in this.sorters) {
      const sorter = this.sorters[s];
      qs += "&sorting["
        + this.getFilterIndex(sorter)
        + "]="
        + sorter.value;
    }

    let j = "";
    if (rel != "" && qs != "") {
      j = "&";
    }

    let limit = '';
    if (0 > this.restrictions.limit) {
      if (rel != "" || qs != "") {
        limit = '&';
      }

      limit += 'limit=99999';
    }

    if (opt != null && opt.skiprel == true) {
      rel = '';
      j = j.substring(1, j.length);
    }

    return rel + j + qs + limit;
  };

  this.getFilterIndex = function (filter) {
    if (!this.containsEmbedded(filter) && this.containsRelations(filter)) {
      return "_embedded."+ filter.field;
    }

    return filter.field;
  };

  this.containsRelations = function (filter) {
    return filter.field.indexOf(".") !== -1;
  };

  this.containsEmbedded = function (filter) {
    return filter.field.indexOf("_embedded") === 0;
  };
}

function SortingManager() {
  this.sorters = [];

  this.push = function (sorter) {
    this.sorters.push(sorter);
  };

  this.getSorters = function () {
    return this.sorters;
  };
}

function FilterManager() {
  this.filters = [];

  this.reset = function () {
    this.filters = [];
  };

  this.push = function (filter) {
    this.filters.push(filter);
  };

  this.getFilters = function () {
    return this.filters;
  };

  this.getFilter = function (index) {
    return this.filters[index];
  };

  this.getFields = function () {
    let filters = [], i = 0, l = 0;
    const filterKeys = Object.keys(this.getFilters());
    for (l = filterKeys.length; i < l; i += 1) {
      filters.push(this.getFilter(filterKeys[i]).field);
    }
    return filters;
  };
}

function QueryQl(options) {
  this.restrictionConfiguration = {};

  const relation = 1;

  this.setCombinator = function (combinator) {
    this.builder.setCombinator(combinator);
    return this;
  };

  this.builder = new QueryStringBuilder(options);

  this.filterManager = new FilterManager();

  this.sortingManager = new SortingManager();

  this.rel = [];

  this.applySorting = function (sorter) {
    this.sortingManager.push(sorter);
  };

  this.applyFilter = function (filter) {
    this.filterManager.push(filter);
  };

  this.applyFilters = function (filters) {
    const filterManager = this.filterManager;
    filters.forEach( function(filter){
      filterManager.push(filter);
    })
  };

  this.getRels = function () {
    this.rel = [];
    for (const f in this.filterManager.getFilters()) {
      const filter = this.filterManager.getFilter(f);
      if (this.builder.containsRelations(filter)) {
        const filterRelation = filter.field.split(".")[relation];
        this.rel.push(filterRelation);
      }
    }
    return this.rel;
  };

  this.getQueryString = function (opt) {
    return this.builder
      .ensureHaveValidCombinator()
      .setFilters(this.filterManager.getFilters())
      .setSorters(this.sortingManager.getSorters())
      .setRestrictions(this.restrictionConfiguration)
      .build(opt);
  };

  this.getFilters = function () {
    return this.filterManager
      .getFields();
  };

  this.containsCombinator = function (jsonQuery) {
    for (const i in jsonQuery) {
      if ("object" == typeof jsonQuery[i]) {
        return true;
      }
    }

    return false;
  };

  this.detectCombinator = function (jsonQuery) {
    for (const i in jsonQuery) {
      if ("object" == typeof jsonQuery[i]) {
        return i;
      }
    }

    return false;
  };

  this.keepDefaultCombinator = function () {
    return this;
  };

  this.keepOrFilteringCombinator = function () {
    this.setCombinator("filtering_or");
    return this;
  };

  this.json = function (jsonQuery) {
    const fields = this.buildFieldsWithRightCombinator(jsonQuery);
    for (const i in fields) {
      if (i === 'conditions') {
        for (let j = 0; j < fields.conditions.length; j++) {
          for (let k in fields.conditions[j] ) {
            const positionalField = k + '|' + j;
            const positionalValue = fields.conditions[j][k];
            this.applyFilter({
              field: positionalField,
              value: positionalValue
            });
          }
        }
      } else if ("object" == typeof fields[i]) {
        let position = 1;
        for (const f in fields[i]) {
          const positionalField = i + "|" + position;
          const positionalValue = fields[i][f];
          position += 1;
          this.applyFilter({
            field: positionalField,
            value: positionalValue
          });
        }
      } else {
        this.applyFilter({ field: i, value: fields[i] });
      }
    }
  };

  this.sort = function(jsonSort) {
    for (const i in jsonSort) {
      this.applySorting({field:i,value:jsonSort[i]});
    }
  };

  this.buildFieldsWithRightCombinator = function (jsonQuery) {
    let fields = jsonQuery;
    if (this.containsCombinator(jsonQuery)) {
      const combinator = this.detectCombinator(jsonQuery);
      this.setCombinator(combinator);
      fields = jsonQuery[combinator];
    }
    return fields;
  };

  this.parseRawField = function (rawField) {
    const explodedRawField = rawField.split("|");
    const operatorFound = explodedRawField[1];
    const availableOperators = ["list", "eq"];
    if (-1 != availableOperators.indexOf(operatorFound)) {
      return {
        field: explodedRawField[0],
        operator: operatorFound
      };
    }

    if ("undefined" == typeof operatorFound) {
      return {
        field: explodedRawField[0],
        operator: "eq"
      };
    }

    throw new Error("operator " + operatorFound + " is not supported");
  };

  this.getFieldOperator = function (fieldName) {
    for (const i in this.filterManager.getFilters()) {
      if (this.filterManager.getFilters()[i].field.indexOf(fieldName) != -1) {
        const parsed = this.parseRawField(
          this.filterManager.getFilters()[i].field
        );

        if ("string" == typeof parsed.operator) {
          return parsed.operator;
        }

        return "eq";
      }
    }
  };

  this.or = function (jsonQuery, opt) {
    if ("object" == typeof opt) {
      if (opt.oldStyle == true) {
        this.json({
          "filtering_or": jsonQuery
        });

        return;
      }
    }

    this.json({
      "or": jsonQuery
    });

    return;
  };

  this.and = function (jsonQuery, opt) {
    if ("object" == typeof opt) {
      if (opt.oldStyle == true) {
        this.json({
          "filtering": jsonQuery
        });

        return;
      }
    }

    if (typeof options != 'undefined' && options.oldStyle == true) {
      this.json({
        "filtering": jsonQuery
      });

      return;
    }

    this.json({
      "and": jsonQuery
    });

    return;
  };

  this.andFiltering = function (jsonQuery) {
    const newJsonQuery = {
      "filtering": jsonQuery
    };
    this.json(newJsonQuery);
  };

  this.orFiltering = function (jsonQuery) {
    const newJsonQuery = {
      "filtering_or": jsonQuery
    };
    this.json(newJsonQuery);
  };

  this.storedQueries = [];

  this.store = function(query, alias, parameter) {
    this.storedQueries[alias] = {
      query: query,
      parameter: parameter
    };
  };

  this.getStoredQuery = function(alias) {
    this.filterManager.reset();
    this.json(this.storedQueries[alias].query);
    return this.getQueryString();
  };

  this.getQueryParameter = function(alias) {
    return this.storedQueries[alias].parameter;
  };

  this.getRawQuery = function(alias) {
    return this.getStoredQuery(alias);
  };

  this.getFinalQuery = function(alias, param) {
    const rawQuery = this.getRawQuery(alias);
    return rawQuery.replace(
      "##" + this.getQueryParameter(alias) + "##",
      param
    );
  };

  this.build = function(conf) {
    this.json(conf.query);
    this.sort(conf.sort);
    return this.getQueryString();
  };

  this.between = function(data, operator) {
    const jsonQuery = {};
    jsonQuery[data.what + "|gte"] = data.from;
    jsonQuery[data.what + "|lte"] = data.to;
    if ("undefined" == typeof operator) {
      this.andFiltering(jsonQuery);
    } else {
      if (operator == "or") {
        this.orFiltering(jsonQuery);
      }
    }
    return this.getQueryString();
  };

  this.restriction = function(restriction) {
    this.restrictionConfiguration = restriction;
  };

  this.clear = () => {
    this.filterManager.reset();
  };

  this.currentWeek = function (date) {
    const monday = giorno.monday();
    let sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    let month = sunday.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }

    let day = sunday.getDate();
    if (day < 10) {
      day = '0' + day;
    }

    const to = sunday.getFullYear() + '-' + month + '-' + day;

    return this.between({
      what: date.date,
      from: monday,
      to: to,
    })
  };

  this.getJson = function () {
    return {
      filtering: this.filterManager.getFilters(),
    };
  };

  this.getJsonKeyValue = function () {
    let ret = [];
    for (let i in this.filterManager.getFilters()) {
      ret.push({
        [this.filterManager.getFilters()[i].field]:
        this.filterManager.getFilters()[i].value
      });
    }
    return ret;
  };
}

global.module = global.module || {};

(module || {}).exports = QueryQl;

