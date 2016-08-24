var Model = require('./model');
var View = require('./view');
var Router = require('./router');

var btnPanel = document.querySelector('#buttonPanel');

btnPanel.addEventListener('click', function(e) {
   var route = e.target.dataset.route;

    if (route){
        Router.handle(route);
    }
});

new Promise(function(resolve) {
    window.onload = resolve;
}).then(function() {
    return Model.login(5267932, 2 | 8 | 8192 | 4);
}).then(function() {
    document.querySelector('.panel').remove();
    document.querySelector('.container').style.display = 'block';
    View.addPartial();
    return Model.getUser().then(function(users) {
        header.innerHTML = View.render('header', users[0]);
    });
}).catch(function(e) {
    console.error(e);
    alert('Ошибка: ' + e.message);
});

