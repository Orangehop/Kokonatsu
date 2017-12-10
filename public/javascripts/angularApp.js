var app = angular.module('kokonatsu', ['ui.router','angularUtils.directives.dirPagination']);

app.factory('macros', ['$http', function($http){
    var o = {
        guilds: [],
        macros: []
    };

    $http.get("/api/macros").success(function(data){
        macros = [];
        angular.copy(data.guilds, o.guilds);
        data.macros.forEach(function(macro){
            if(macro.link.endsWith("gifv")){
                macro.link = macro.link.replace("gifv", "mp4");
            }
            macros.push(macro);
        });
        angular.copy(macros, o.macros);
    });

    return o;
}]);

app.factory('user', ['$http', function($http){
    var o = {
        user: {}
    };

    $http.get("/api/user").success(function(data){
        angular.copy(data.user, o.user);
    });

    return o;
}]);

app.controller('SearchCtrl', [
'$scope',
function($scope){
    $scope.sortKeys = ["Macro Names", "Usage", "Score"];

    $scope.setSortKey = function(key){
        var sortTerm;
        if(key == "Macro Names") sortTerm = 'name';
        else if(key == "Usage") sortTerm = '-usage';
        else if(key == "Score") sortTerm = '-score';
        $scope.searchCtrl.sortKey = sortTerm;
        $scope.pagination.currentPage = 1;
    }

    $scope.searchCtrl.filter;
}]);

app.controller('MacroCtrl',[
'$http',
'$scope',
function($http, $scope){
    $scope.video = function(link){
        if(link.endsWith("mp4")) return true;
        return false;
    };

    $scope.img = function(macro, link){
        if(link.endsWith("mp4") || link.includes("gfycat.com")) return false;
        return true;
    };

    $scope.checkExists = function(needle, haystack){
        if(haystack.indexOf(needle) == -1) return false;
        else return true;
    }

    $scope.toggleLike = function(macro){
        if($scope.user.likes.indexOf(macro._id) == -1) like(macro);
        else neutral(macro);
    }

    $scope.toggleDislike = function(macro){
        if($scope.user.dislikes.indexOf(macro._id) == -1) dislike(macro);
        else neutral(macro);
    }

    $scope.toggleFavorite = function(macro){
        if($scope.user.favorites.indexOf(macro._id) == -1) favorite(macro);
        else unfavorite(macro);
    }

    var like = function(macro){
        $http.put('/api/like/'+macro._id).success(function(res){
            if(res == null) return;
            macro.score = res.macro.score;
            $scope.user .likes = res.user.likes;
            $scope.user .dislikes = res.user.dislikes;
        });
    }

    var dislike = function(macro){
        $http.put('/api/dislike/'+macro._id).success(function(res){
            if(res == null) return;
            macro.score = res.macro.score;
            $scope.user .likes = res.user.likes;
            $scope.user .dislikes = res.user.dislikes;
        });
    }

    var neutral = function(macro){
        $http.put('/api/neutral/'+macro._id).success(function(res){
            if(res == null) return;
            macro.score = res.macro.score;
            $scope.user .likes = res.user.likes;
            $scope.user .dislikes = res.user.dislikes;
        });
    }

    var favorite = function(macro){
        $http.put('/api/favorite/'+macro._id).success(function(res){
            if(res == null) return;
            $scope.user.favorites = res.user.favorites;
        });
    }

    var unfavorite = function(macro){
        $http.put('/api/unfavorite/'+macro._id).success(function(res){
            if(res == null) return;
            $scope.user.favorites = res.user.favorites;
        });
    }
}])

app.controller('MainCtrl', [
'$http',
'$sce',
'$scope',
'macros',
'user',
function($http, $sce, $scope, macros, user){
    $scope.macros = macros.macros;
    $scope.guilds = macros.guilds;
    $scope.displayMacros = macros.macros;
    $scope.user = user.user;
    $scope.displayLetter="ALL";

    $scope.searchCtrl = {
        sortKey: "name",
        filter: ""
    };

    $scope.currentTab = 0;

    $scope.pagination = {
        currentPage: 1
    }

    $scope.gfycat = function(link) {
        if(link.includes("gfycat.com")) return true;
        return false;
    }

    $scope.gfycatDataID = function(link) {
        var index = link.lastIndexOf("/");
        return link.substring(index+1);
    }

    $scope.trustAsResourceUrl = $sce.trustAsResourceUrl;

    $scope.reloadGfycat = function() {
        $scope.pagination.currentPage = 1;
        gfyCollection.init();
    }

    $scope.pageChanged = function() {
        setTimeout(function() {gfyCollection.init();}, 100);
    }

    $scope.setGuild = function(index){
        $scope.currentTab = index;
    }

    $scope.alphabet = ["ALL","#","?","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    $scope.filterAlphabet = function(letter){
        $scope.displayLetter = letter;
        if(letter == "ALL"){
            $scope.displayMacros = $scope.macros;
        }
        else if(letter == "#"){
            $scope.displayMacros = [];
            $scope.macros.forEach(function(macro){
                if(!isNaN(parseInt(macro.name[0]))){
                    $scope.displayMacros.push(macro);
                }
            });
        }
        else if(letter == "?"){
            $scope.displayMacros = [];
            $scope.macros.forEach(function(macro){
                var asciiCode = macro.name.charCodeAt(0);
                if(!((asciiCode >= 65 && asciiCode <= 90) || (asciiCode >= 97 && asciiCode <= 122) || (asciiCode >= 48 && asciiCode <= 57))){
                    $scope.displayMacros.push(macro);
                }
            });
        }
        else{
            var startLetter = letter.toLowerCase();
            $scope.displayMacros = [];
            $scope.macros.forEach(function(macro){
                if(macro.name.startsWith(startLetter)){
                    $scope.displayMacros.push(macro);
                }
            });
        }
        gfyCollection.init();
        $scope.pagination.currentPage = 1;
    }
}]);

app.directive('controller', function() {
    return {
        link: function($scope, element, attrs) {
            // Trigger when number of children changes,
            // including by directives like ng-repeat
            var watch = $scope.$watch(function() {
                return element.children().length;
            }, function() {
                // Wait for templates to render
                $scope.$evalAsync(function() {
                    // Finally, directives are evaluated
                    // and templates are renderer here
                    var fileref=document.createElement('script');
                    fileref.setAttribute("type","text/javascript");
                    fileref.setAttribute("src", "https://assets.gfycat.com/gfycat.js");
                    document.getElementsByTagName("head")[0].appendChild(fileref);
                });
            });
        },
    };
});