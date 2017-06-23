'use strict';



/**
 *  Common Block which we need to keep globally
 */

/**
 * 
 */
var sortByKey = function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


/**
 * 
 */
var sortByKeyStr = function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key].toUpperCase();
        var y = b[key].toUpperCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}







dbMfgModule.factory('IcMean', [
    function() {
        return {
            name: 'ic-mean'
        };
    }
]);


dbMfgModule.factory('icdb', ['$http', function($http) {
    var dataFactory = {};

    dataFactory.insert = function(model, data, callback) {
        data.model = model;
        $http.post('/api/common/add-data', data).success(function(result) {
            callback(result);
        });
    };

    dataFactory.update = function(model, _id, data, callback) {
        data.model = model;
        data._id = _id;
        $http.post('/api/common/edit-data', data).success(function(result) {
            callback(result);
        });
    };

    dataFactory.updateAddChild = function(model, entityId, entityKey, data, callback) {
        data.model = model;
        data.entityId = entityId;
        data.entityKey = entityKey;
        $http.post('/api/common/update-data', data).success(function(result) {
            callback(result);
        });
    };

    dataFactory.updateChild = function(model, entityId, entityKey, childEntityId, data, callback) {
        data.model = model;
        data.entityId = entityId;
        data.childEntityId = childEntityId;
        data.entityKey = entityKey;
        $http.post('/api/common/update-child-data', data).success(function(result) {
            callback(result);
        });
    };

    dataFactory.removeChilds = function(model, entityId, entityKey, data, callback) {
        data.model = model;
        data._id = entityId;
        data.entityKey = entityKey;
        $http.post('/api/common/delete', data).success(function(result) {
            callback(result);
        });
    };

    dataFactory.insertChild = function(model, entityId, entityKey, data, callback) {
        data.model = model;
        data.entityId = entityId;
        data.entityKey = entityKey;
        data.isChildInsert = true;
        $http.post('/api/common/add-data', data).success(function(result) {
            callback(result);
        });
    };

    dataFactory.remove = function(model, _id, callback) {
        $http.post('/api/common/delete', {
            model: model,
            _id: _id
        }).success(function(result) {
            callback(result);
        });
    };

    dataFactory.get = function(model, callback) {
        $http.post('/api/common/get-data', {
            model: model,
            companyId: companyId
        }).success(function(result) {
            callback(result);
        });
    };

    dataFactory.getSingle = function(model, _id, callback) {
        $http.post('/api/common/single-data', {
            model: model,
            _id: _id
        }).success(function(result) {
            callback(result);
        });
    };

    dataFactory.getCondition = function(model, condition, callback) {
        $http.post('/api/common/condition-data', {
            model: model,
            condition: condition
        }).success(function(result) {
            callback(result);
        });
    };

    dataFactory.removeChilds = function(model, entityId, entityKey, data, callback) {
        data.model = model;
        data._id = entityId;
        data.entityKey = entityKey;
        $http.post('/api/common/delete', data).success(function(result) {
            callback(result);
        });
    };

    dataFactory.orderChange = function(model, data, callback) {
        data.model = model;
        $http.post('/api/common/order-change', data).success(function(result) {
            callback(result);
        });
    };


    return dataFactory;
}]);



dbMfgModule.factory('alertService', ['toastr', function(toastr) {

    var alertService = {}
    var generateMsg = function(msgType, msg) {

        if (msgType == 'success') {
            toastr.success(msg, 'Success', {
                iconClass: 'toast-gray toast-gray-success',
                closeButton: true,
                toastClass: 'toast',
                closeHtml: '<i class="fa fa-check close-tostr"></i> ',
                progressBar: true,
                templates: {
                  toast: 'directives/toast/toast.html',
                  progressbar: 'directives/progressbar/progressbar.html'
                },
                iconClasses: {
                    success: 'toast-success'
                }
            });
        } else {
            toastr.error(msg, 'Error', {
                iconClass: 'toast-gray toast-gray-err',
                closeButton: true,
                toastClass: 'toast',
                closeHtml: '<i class="fa fa-exclamation-triangle close-tostr"></i> ',
                progressBar: true,
                templates: {
                  toast: 'directives/toast/toast.html',
                  progressbar: 'directives/progressbar/progressbar.html'
                },
                iconClasses: {
                    warning: 'toast-warning'
                }
            });
        }

    }


    alertService.flash = function(type, msg, isRedirect) {
        if (type == "success" || type == "error") {
            generateMsg(type, msg);
        }
    };
    return alertService;

}]);

//Global service for global variables
dbMfgModule.factory('Global', [function() {

    var _this = this;
    _this._data = {
        user: window.user || {
            _id: '123123123',
            fname: 'jayesh',
            email: 'jsbhalodia.dev@gmail'
        },
        authenticated: false,
        isAdmin: false
    };

    // if (window.user && window.user.roles) {
    //   _this._data.authenticated = window.user.roles.length;
    //   _this._data.isAdmin = window.user.roles.indexOf('admin') !== -1;
    // }

    return _this._data;
}]);