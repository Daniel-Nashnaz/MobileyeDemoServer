const indexRuoter = require('./index');

exports.routesInit = (app) => {
    app.use('/', indexRuoter);

}