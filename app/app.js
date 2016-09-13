(function() {
  'use strict';

  angular
    .module('myApp', ['ngMap'])
    .controller('myController', myController)
    .controller('mapCtrl', mapCtrl)
    .service('condoApi', condoApi)
    .filter('startFrom', startFrom)
    .directive('backImg', backImg);

  myController.$inject = ['$scope', 'condoApi'];
  mapCtrl.$inject = ['$scope', 'NgMap', 'condoApi', '$compile'];
  condoApi.$inject = ['$q', '$http'];

  //Temporary dummy controller
  function myController($scope, condoApi) {
    condoApi.getCondoList().then(function(condoList) {
      $scope.condoList = condoList;
    });
    $scope.phones = [
        {
        name: 'Nexus S',
        snippet: 'Fast just got faster with Nexus S.'
        }, {
        name: 'Motorola XOOM™ with Wi-Fi',
        snippet: 'The Next, Next Generation tablet.'
        }, {
        name: 'MOTOROLA XOOM™',
        snippet: 'The Next, Next Generation tablet.'
        }
    ];
    }

  //Main controller for map and details
  function mapCtrl($scope, NgMap, condoApi, $compile) {
    $scope.googleMapsUrl='https://maps.googleapis.com/maps/api/js?key=AIzaSyC9efZV5sak_Geyb6y7UMSfAaNt7fFUcfM';

    condoApi.getImageList().then(function(imageList) {
        $scope.imageList = imageList;
    });

    //Drawing custom marker image on canvas for google maps
    /*var canvas = document.createElement('canvas');
    //var canvas = document.getElementById('rc');
    var ctx = canvas.getContext('2d');
    ctx.beginPath();  
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#ccc";
    ctx.arc(160,85,10,0,Math.PI*2);
		
    ctx.stroke();
    ctx.fill();
    
    ctx.beginPath();    
    ctx.fillStyle = "#93f";
    ctx.strokeStyle = "#ccc";
    ctx.arc(160,85,6,0,Math.PI*2);
    ctx.stroke();
    ctx.fill();

    var img = ctx.canvas.toDataURL('image/png');

    $scope.image = img;*/
    $scope.name = '';
    $scope.location = '';
    $scope.limit = 20;

    var ctrl = this;

    NgMap.getMap().then(function(map){
      ctrl.map = map;
      var markers = [];
      condoApi.getCondoList().then(function(condoList) {
        $scope.condoList = condoList.listing;
        var createMarker = function (info){
          var markers = [];
          var marker = new google.maps.Marker({
            //id: info.id,
            icon: 'img/rent3.gif', //icon: 'https://www.google.com/intl/en_us/mapfiles/ms/icons/yellow.png', //icon: $scope.image,
            position: new google.maps.LatLng(info.lat, info.lng),
            map: ctrl.map,
            title: info.name_en
          });
          var infowindow =  new google.maps.InfoWindow({
            content: '',
            maxWidth: 170,
            maxHeight: 115
          });
          google.maps.event.addListener(marker, 'mouseover', function(){ //'click'
                $scope.name = info.name_en;
                $scope.location = info.location;
                $scope.activeImage = 'img/house.jpg';
                var source = '<div>'
                            + '<div class="info-container">'
                              + '<div class="row">'
                                + '<div class="col-xs-5 small-img-container">'
                                  + '<img ng-src="{{activeImage}}"></img>'
                                + '</div>'
                                + '<div class="col-xs-7 small-details-container">'
                                  + '<div class="row">'
                                    + '<div class="col-xs-12 condopricesmall">'
                                      + '$900/mo'
                                    + '</div>'
                                  + '</div>'
                                  + '<div class="row">'
                                    + '<div class="col-xs-12 condonamesmall">'
                                      + '{{name}}'
                                    + '</div>'
                                  + '</div>'
                                  + '<div class="row">'
                                    + '<div class="col-xs-12 condolocationsmall">'
                                      + '{{location}}'
                                    + '</div>'
                                  + '</div>'
                                + '</div>'
                              + '</div>'
                            + '</div>'
                          + '</div>'
                var template = angular.element(source);
                var linkFunction = $compile(template);
                var result = linkFunction($scope);
                $scope.$apply();
                infowindow.setContent(template.html());
                infowindow.open(ctrl.map, marker);
          });
          google.maps.event.addListener(marker, 'mouseout', function(){
              infowindow.close();
          });
          markers.push(marker);
        }
        for (var i = 0; i < $scope.condoList.length; i++) {
          createMarker($scope.condoList[i]);
        }
      });
    });
  }

  //Makes API calls
  function condoApi($q, $http) {
    function _getImageList() {
      var d = $q.defer();
      $http.get('https://www.dreamstime.com/photos-images/house-interior.html').then(function(response) {
        var m,
            urls = [], 
            rex = /<img[^>]+src="?([^"\s]+.jpg)"?\s*\/>/g,
            str = response.data;
            

        m = rex.exec( str );
        while ( m = rex.exec( str ) ) {
            urls.push( m[1] );
        }
        return d.resolve(urls);
        //console.log( urls );
      });
      return d.promise;
    }
    function _getCondoList() {
      var d = $q.defer();
      $http.get('http://tfh.ladargroup.com/rest/search/condo?nl=13,100&fr=14,101').then(function(response) {
        return d.resolve(response.data);
      });
      return d.promise;
    }
    return { 
      getImageList: _getImageList,
      getCondoList: _getCondoList
    };
  }

  //For starting ng-repeat from a specific index (i.e repeat 50-100)
  function startFrom() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
  }

  //For giving custom background image to a div dynamically
  function backImg(){
    /*return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25)), url(' + url + ')',
            'background-size' : 'cover'
        });
    };*/
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25)), url(' + value + ')'
            });
        });
    };
  }
})();