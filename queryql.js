function QueryQl() {
    return {
        allowed: function () {
            return [
                'filtering',
                'filtering_or',
                'printing',
                'rel',
                'sorting',
            ];
        }
    };
}

module.exports = QueryQl;
