/*var myApp = angular.module('myApp', []);

myApp.controller('myController', function myController($scope) {
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
});

myApp.controller('mapController', ['NgMap', function mapController(NgMap) {
  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
  });
}]);*/

(function() {
  'use strict';

  angular
    .module('myApp', ['ngMap'])
    .controller('myController', myController)
    .controller('mapCtrl', mapCtrl)
    .service('condoApi', condoApi);

  myController.$inject = ['$scope', 'condoApi'];
  mapCtrl.$inject = ['$scope', 'NgMap', 'condoApi'];
  condoApi.$inject = ['$q', '$http'];

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

  function mapCtrl($scope, NgMap, condoApi) {
    $scope.googleMapsUrl='https://maps.googleapis.com/maps/api/js?key=AIzaSyC9efZV5sak_Geyb6y7UMSfAaNt7fFUcfM';

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
            icon: 'https://www.google.com/intl/en_us/mapfiles/ms/icons/yellow.png',
            position: new google.maps.LatLng(info.lat, info.lng),
            map: ctrl.map,
            title: info.name_en
          });
          google.maps.event.addListener(marker, 'click', function(){
                $scope.name = info.name_en;
                $scope.location = info.location;
                $scope.$apply();
          });
          markers.push(marker);
          //var latlng = new google.maps.LatLng(info.lat, info.lng);
          //markers[i].setPosition(latlng);
          //markers[i].setMap(ctrl.map);
        }
        for (var i = 0; i < $scope.condoList.length; i++) {
          createMarker($scope.condoList[i]);
        }
      });
    });
  }

  function condoApi($q, $http) {
    function _getCondoList() {
      var d = $q.defer();
      $http.get('http://tfh.ladargroup.com/rest/search/condo?nl=13,100&fr=14,101').then(function(response) {
        return d.resolve(response.data);
      });
      return d.promise;
    }
    return { 
      getCondoList: _getCondoList
    };
  }
})();