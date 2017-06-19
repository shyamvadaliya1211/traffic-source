//
angular.element(document).ready(function() {
    
    if (window.location.hash === '#_=_') window.location.hash = '#!';
    
    try {
        angular.bootstrap(document, ['AMP']);
    } catch(es) {
        console.log('es > ', es);
    }
});
