var Model = require('./model');
var View = require('./view');

module.exports = {
    musicRoute: function() {
        return Model.getMusic().then(function(music) {
            results.innerHTML = View.render('music', {list: music});
        });
    },
    friendsRoute: function() {
        return Model.getFriends().then(function(friends) {
            results.innerHTML = View.render('friends', {list: friends});
        });
    },
    newsRoute: function() {
        return Model.getNews().then(function(news) {
            results.innerHTML = View.render('news', {list: news.items});
        });
    },
    photosRoute: function() {
        Model.getPhotos().then(function(albums) {
            results.innerHTML = View.render('photos', {list: albums});

            document.addEventListener('click', function(e){
                var elem = e.target,
                    dropdown = (elem.dataset && elem.dataset.toggle == 'dropdown')? elem.nextElementSibling : null;

                if (dropdown) {
                    dropdown.style.display = (getComputedStyle(dropdown).display == 'none') ? 'block' : 'none';
                }
            });

            document.addEventListener('click', function(e){
                e.preventDefault();
                var elem = e.target,
                    sortBy = (elem.dataset)? elem.dataset.sortBy : null,
                    unsortedPhotos = [], sortedPhotos = [];

                if (sortBy){
                    var album = elem.closest('.panel'),
                        albumId = album.dataset.albumId,
                        results = album.lastElementChild;
                    elem.closest('.dropdown-menu').style.display = 'none';
                    for (var al of albums){
                        if (al.id == albumId){
                            unsortedPhotos = al.photos;
                            break;
                        }
                    }
                    sortedPhotos = Model.sortPhotos(unsortedPhotos,sortBy);
                    results.innerHTML = View.render('sortedPhotos', {photos: sortedPhotos});
                }
            });

        });
    }

};
