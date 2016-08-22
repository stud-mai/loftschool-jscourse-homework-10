module.exports = {
    login: function(appId, perms) {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: appId
            });

            VK.Auth.getLoginStatus(response => {
                if (response.session) {
                    resolve(response);
                } else {
                    authButton.addEventListener('click', () => {
                        VK.Auth.login(function(response) {
                            if (response.session) {
                                resolve(response);
                            } else {
                                alert('Авторизация прошла не удачно!');
                            }
                        }, perms)});
                }
            });

        });
    },
    callApi: function(method, params) {
        return new Promise(function(resolve, reject) {
            VK.api(method, params, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response.response);
                }
            });
        });
    },
    getUser: function() {
        return this.callApi('users.get', {name_case: 'gen'});
    },
    getMusic: function() {
        return this.callApi('audio.get', {});
    },
    getFriends: function() {
        return this.callApi('friends.get', {fields: 'photo_100'});
    },
    getNews: function() {
        return this.callApi('newsfeed.get', {filters: 'post', count: 20});
    },
    getPhotos: function() {
        let code = `var photoCall = API.photos.getAll({"extended": "1","count": 200,"v":"5.53"});
                var photos = photoCall.items;
                var count = photoCall.count;
                var offset = 200;
                while (offset < count && offset < 5000){
                    var photoCall = API.photos.getAll({"offset":offset,"extended": "1","count": 200,"v":"5.53"});                                       
                    photos = photos + photoCall.items;
                    count = photoCall.count;
                    offset = offset + 200;
                }
                
                var id=photos@.id;
                var cmts=API.photos.getAllComments({"count": 100,"v":"5.53"});
                var cmt = cmts.items;
                var count = cmts.count;
                var offset = 100;
                while (offset < count && offset < 2500){
                    var cmts = API.photos.getAllComments({"count": 100,"offset":offset,"v":"5.53"});                                   
                    cmt = cmt + cmts.items;
                    count = cmts.count;
                    offset = offset + 100;
                }
                
                var uid=cmt@.from_id;
                var usr =  API.users.get({"user_ids":uid,"fields":"photo_50","v":"5.53"});
                return {"photos":photos,"comments":cmt,"users":usr};`;

        return this.callApi('execute', {code: code, v: 5.53}).then(function(response){
            var photos = response.photos,
                comments = response.comments.reverse(),
                users = response.users;
            for (var i = 0, len = photos.length; i < len; i++){
                var pid = photos[i].id,
                    counter = 0;
                photos[i].comments = {
                    data: [],
                    count: 0
                };
                comments.forEach((obj) => {
                    if (pid === obj.pid) {
                        var person = {};
                        for (var j = 0, len = users.length; j < len; j++) {
                            if (users[j].id === obj.from_id){
                                person = users[j];
                                break;
                            }
                        }
                        var data = {
                            from_id: person,
                            date: obj.date,
                            text: obj.text,
                        };
                        photos[i].comments.data.push(data);
                        counter++;
                    }
                });
                photos[i].comments.count = counter;
            }
            return photos;
        });

        /*
        /*
        *********************
        * Вариант с использованием рекурсии и setTimeout (должно быть использовано в Controller)
        * *****
        * Загружает комментарии к каждой фотографии (занимает 35 сек для ~100 фото)
        * *******************
        var code = 'var photoCall = API.photos.getAll({"extended": "1","count": 200,"v":"5.53"});' +
                    'var photos = photoCall.items;' +
                    'var count = photoCall.count;' +
                    'var offset = 200;' +
                    'while (offset < count){' +
                        'var photoCall = API.photos.getAll({"owner_id":1,"offset":offset,"extended": "1","count": 200,"v":"5.53"});' +
                        'photos = photos+photoCall.items;' +
                        'offset = offset + 200;' +
                    '}' +
                    'return photos;';

        this.callApi('execute', {code: code, v: 5.53}).then((photos) => {
            function getCom(source, count) {
                let code = ``;
                if (count < source.length) {
                    for (var i = count; i < count + 3; i++) {
                        if (source[i]) {
                            //console.log('Model.getComments('+i+');', source[i].id);
                            Model.getComments(source[i].id).then((response) => {
                                console.log(response)
                            });
                        }
                    }
                    count += 3;
                    setTimeout(() => {
                        getCom(source, count)
                    }, 999);
                }
            };

            getCom(photos, 0);
        });
        ******************
        */
    },
    getComments: function(id) {
        var code = `var commentCall = API.photos.getComments({"photo_id": "${id}","extended": "1","count": 100,"v":"5.53"});
                    var comments = commentCall.items;
                    var authors = commentCall.profiles;
                    var count = commentCall.count;
                    var offset = 100;
                    while (offset < count && offset < 2500){
                        var commentCall = API.photos.getComments({"offset":offset,"photo_id": "${id}","extended": "1","count": 100,"v":"5.53"});
                        var comments = comments + commentCall.items;
                        var authors = authors + commentCall.profiles;
                        offset = offset + 100;
                    }
                    return {"comments": comments, "authors": authors};`;

        return this.callApi('execute', {code: code, v: 5.53});
    },
    getAllComments: function(offset /*, comments = []*/) {
        //return this.callApi('photos.getAllComments', {offset: offset, count: 100, v: 5.53})

        /* Версия использования рекурсии без промиса
        /*
        var that = this;

        return VK.api('photos.getAllComments', {offset: offset, count: 100, v: 5.53}, (response) => {
            var commentsNum = parseInt(response.response.count);

            comments = comments.concat(response.response.items);
            if (commentsNum > 100 && comments.length !== commentsNum) that.getComments(comments.length, comments)
            else return comments;
        });
        */

        /* Версия использования рекурсии для промиса
        /*
        var call = this.callApi('photos.getAllComments', {offset: offset, count: 100, v: 5.53}),
            that = this, temp;

        temp = call.then(function(response){
            var commentsNum = parseInt(response.count);
            comments = comments.concat(response.items);
            if (commentsNum > 100 && comments.length !== commentsNum) that.getComments(comments.length, comments)
            else return comments;
        });

        return temp.then(comments => {console.log(comments)});
        */
    }
};
