var Controller = require('./controller');

module.exports = {
    handle: function(route) {
        var routeName = route + 'Route';

        if (!Controller.hasOwnProperty(routeName)) {
            throw new Error('Маршрут не найден!');
        }

        Controller[routeName]();
    }
};
