(function() {
  'use strict';

  angular
    .module('myApp', ['ngMap', 'ui.bootstrap'])
    .controller('myController', myController)
    .controller('mapCtrl', mapCtrl)
    .service('condoApi', condoApi)
    .filter('startFrom', startFrom)
    .directive('backImg', backImg);

  myController.$inject = ['$scope', 'condoApi'];
  mapCtrl.$inject = ['$scope', 'NgMap', 'condoApi', '$compile', '$timeout'];
  condoApi.$inject = ['$q', '$http'];

  //Temporary dummy controller
  function myController($scope, condoApi) {
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
  function mapCtrl($scope, NgMap, condoApi, $compile, $timeout) {
    $scope.googleMapsUrl='https://maps.googleapis.com/maps/api/js?key=AIzaSyC9efZV5sak_Geyb6y7UMSfAaNt7fFUcfM';

    $scope.markers = [];
    $scope.btsMarkers = [];
    //$scope.imageList = [];
    $scope.name = '';
    $scope.location = '';
    $scope.limit = 10000;
    $scope.loading = true;
    $scope.listingFilter = 'rent,sale';
    $scope.listingOptions = {
      isForRent: true,
      isForSale: true
    };
    $scope.rentCount = 0;
    $scope.saleCount = 0;

    /*$scope.listingOptions = [
      {
        label: 'All',
        value: ''
      },
      {
        label: 'For Rent',
        value: 'rent'
      },
      {
        label: 'For Sale',
        value: 'sale'
      }
    ];*/

    $scope.listingFilterChanged = function(listingOptions, type) {
      loading();
      if (!listingOptions.isForRent && !listingOptions.isForSale) {
        if(type === 'rent') {
          listingOptions.isForSale = true;
          $scope.listingFilter = 'sale';
        } else {
          listingOptions.isForRent = true;
          $scope.listingFilter = 'rent';
        }
      } else if (listingOptions.isForRent && listingOptions.isForSale) {
        $scope.listingFilter = 'rent,sale';
      } else if (listingOptions.isForRent && !listingOptions.isForSale) {
        $scope.listingFilter = 'rent';
      } else {
        $scope.listingFilter = 'sale';
      }
      //$scope.listingFilter = $scope.listingFilter === '' ? 'rent,sale' : filter;
      $timeout(setMap, 1000).then(function() {
        loading();
      });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function loading() { 
      $scope.loading = !$scope.loading;
    }

    var ctrl = this;
    var mc = null;

    NgMap.getMap().then(function(map){
      ctrl.map = map;
      /*generateBtsMarkers($scope.btsStationsCoords1, 'img/pin-for-bts.png');
      generateBtsMarkers($scope.btsStationsCoords2, 'img/pin-for-transportation.png');
      generateBtsMarkers($scope.srtStationsCoords, 'img/pin-for-arl.png');
      generateBtsMarkers($scope.mrtStationsCoords, 'img/pin-for-arl.png');
      generateBtsMarkers($scope.brtStationsCoords, 'img/pin-for-bts.png');*/
      var timeout = $timeout(setMap).then(loading);
      var status = 'undone';
      ctrl.map.addListener('bounds_changed', function() {
        //loading sign for details here
        if (status === 'undone') {
          $timeout(loading);
          timeout = $timeout(setMap, 1000);
          status = 'done';
          timeout.then(function() {
            status = 'undone';
            $timeout(loading);
          });
        }
      });
    });

    $scope.btsCoords = [
      {
        lat: 13.661229108173657,
        lng: 100.60193538665771
      },
      {
        lat: 13.66815141121943,
        lng: 100.60466051101685
      },
      {
        lat: 13.679931368972557,
        lng: 100.60957431793213
      },
      {
        lat: 13.684976763510683,
        lng: 100.61047554016113
      },
      {
        lat: 13.689313214516257,
        lng: 100.60901641845703
      },
      {
        lat: 13.696651641782516,
        lng: 100.60549736022949
      },
      {
        lat: 13.705574193616373,
        lng: 100.60103416442871
      },
      {
        lat: 13.709910264691167,
        lng: 100.59880256652832
      },
      {
        lat: 13.715246857655304,
        lng: 100.59120655059814
      },
      {
        lat: 13.71958275011919,
        lng: 100.58524131774902
      },
      {
        lat: 13.724252083187412,
        lng: 100.57863235473633
      },
      {
        lat: 13.730463819728453,
        lng: 100.56970596313477
      },
      {
        lat: 13.737008894291328,
        lng: 100.56035041809082
      },
      {
        lat: 13.740552329741211,
        lng: 100.55541515350342
      },
      {
        lat: 13.742344870794502,
        lng: 100.55262565612793
      },
      {
        lat: 13.743053546032764,
        lng: 100.5488920211792
      },
      {
        lat: 13.744137398132912,
        lng: 100.5430555343628
      },
      {
        lat: 13.745513049345915,
        lng: 100.53455829620361
      },
      {
        lat: 13.746332,
        lng: 100.530860
      },
      {
        lat: 13.751655,
        lng: 100.531568
      },
      {
        lat: 13.753242, 
        lng: 100.531760
      },
      {
        lat: 13.756818,
        lng: 100.533776
      },
      {
        lat: 13.762761,
        lng: 100.537079
      },
      {
        lat: 13.770125, 
        lng: 100.541229
      },
      {
        title: 'Sanam Pao',        
        lat: 13.772369,
        lng: 100.542031
      },
      {
        title: 'Ari',        
        lat: 13.779785,
        lng: 100.544700
      },
      {
        title: 'Saphan Khwai',        
        lat: 13.793650,
        lng: 100.549688
      },
      {
        lat: 13.798452, 
        lng: 100.551398
      },
      {
        title: 'Mo Chit',        
        lat: 13.802442,
        lng: 100.553753
      }
    ];

    $scope.btsCoords2 = [
      {
        title: 'National Stadium',        
        lat: 13.74651351788079,
        lng: 100.52910804748535
      },
      {
        title: 'Siam',        
        lat: 13.745513049345915,
        lng: 100.53455829620361
      },
      {
        lat: 13.744484, 
        lng: 100.540383
      },
      {
        title: 'Ratchadamri',        
        lat: 13.739339,
        lng: 100.539484
      },
      {
        lat: 13.735055, 
        lng: 100.538831
      },
      {
        lat: 13.729498, 
        lng: 100.536702
      },
      { 
        title: 'Sala Daeng',        
        lat: 13.728519,
        lng: 100.534343
      },
      {
        lat: 13.726150, 
        lng: 100.528149
      },
      {
        title: 'Chong Nonsi',        
        lat: 13.723725,
        lng: 100.529477
      },
      {
        lat: 13.721891, 
        lng: 100.530242
      },
      {
        title: 'Surasak',        
        lat: 13.719281,
        lng: 100.521616
      },
      {
        lat: 13.717947, 
        lng: 100.517160
      },
      {
        title: 'Saphan Taksin',        
        lat: 13.718752,
        lng: 100.514146
      },
      {
        lat: 13.720822, 
        lng: 100.505685
      },
      {
        title: 'Krung Thon Buri',        
        lat: 13.720894,
        lng: 100.502900
      },
      {
        title: 'Wongwian Yai',        
        lat: 13.721020,
        lng: 100.495298
      },
      {
        title: 'Pho Nimit',        
        lat: 13.719192,
        lng: 100.485934
      },
      {
        title: 'Talat Phlu',        
        lat: 13.714247,
        lng: 100.476719
      },
      {
        lat: 13.711970, 
        lng: 100.472610
      },
      {
        title: 'Wutthakat',        
        lat: 13.713094,
        lng: 100.468717
      },
      {
        lat: 13.714301, 
        lng: 100.465158
      },
      {
        lat: 13.714809, 
        lng: 100.460738
      },
      {
        lat: 13.717456, 
        lng: 100.458428
      },
      {
        title: 'Bang Wa',        
        lat: 13.720698,
        lng: 100.457803
      }
    ];

    $scope.btsStationsCoords1 = [
      {
        title: 'Bearing',
        lat: 13.661229108173657,
        lng: 100.60193538665771
      },
      {
        title: 'Bang Na',        
        lat: 13.66815141121943,
        lng: 100.60466051101685
      },
      {
        title: 'Udom Suk',        
        lat: 13.679931368972557,
        lng: 100.60957431793213
      },
      {
        title: 'Punnawithi',        
        lat: 13.689313214516257,
        lng: 100.60901641845703
      },
      {
        title: 'Bang Chak',        
        lat: 13.696651641782516,
        lng: 100.60549736022949
      },
      {
        title: 'On Nut',        
        lat: 13.705574193616373,
        lng: 100.60103416442871
      },
      {
        title: 'Phra Khanong',        
        lat: 13.715246857655304,
        lng: 100.59120655059814
      },
      {
        title: 'Ekkamai',        
        lat: 13.71958275011919,
        lng: 100.58524131774902
      },
      {
        title: 'Thong Lo',        
        lat: 13.724252083187412,
        lng: 100.57863235473633
      },
      {
        title: 'Phrom Phong',        
        lat: 13.730463819728453,
        lng: 100.56970596313477
      },
      {
        title: 'Asok',        
        lat: 13.737008894291328,
        lng: 100.56035041809082
      },
      {
        title: 'Nana',        
        lat: 13.740552329741211,
        lng: 100.55541515350342
      },
      {
        title: 'Phloen Chit',        
        lat: 13.743053546032764,
        lng: 100.5488920211792
      },
      {
        title: 'Chit Lom',        
        lat: 13.744137398132912,
        lng: 100.5430555343628
      },
      {
        title: 'Siam',        
        lat: 13.745513049345915,
        lng: 100.53455829620361
      },
      {
        title: 'Ratchatewi',        
        lat: 13.751655,
        lng: 100.531568
      },
      {
        title: 'Phaya Thai',        
        lat: 13.756818,
        lng: 100.533776
      },
      {
        title: 'Victory Monument',        
        lat: 13.762761,
        lng: 100.537079
      },
      {
        title: 'Sanam Pao',        
        lat: 13.772369,
        lng: 100.542031
      },
      {
        title: 'Ari',        
        lat: 13.779785,
        lng: 100.544700
      },
      {
        title: 'Saphan Khwai',        
        lat: 13.793650,
        lng: 100.549688
      },
      {
        title: 'Mo Chit',        
        lat: 13.802442,
        lng: 100.553753
      }
    ];

    $scope.btsStationsCoords2 = [
      {
        title: 'Bang Wa',        
        lat: 13.720698,
        lng: 100.457803
      },
      {
        title: 'Wutthakat',        
        lat: 13.713094,
        lng: 100.468717
      },
      {
        title: 'Talat Phlu',        
        lat: 13.714247,
        lng: 100.476719
      },
      {
        title: 'Pho Nimit',        
        lat: 13.719192,
        lng: 100.485934
      },
      {
        title: 'Wongwian Yai',        
        lat: 13.721020,
        lng: 100.495298
      },
      {
        title: 'Krung Thon Buri',        
        lat: 13.720894,
        lng: 100.502900
      },
      {
        title: 'Saphan Taksin',        
        lat: 13.718752,
        lng: 100.514146
      },
      {
        title: 'Surasak',        
        lat: 13.719281,
        lng: 100.521616
      },
      {
        title: 'Chong Nonsi',        
        lat: 13.723725,
        lng: 100.529477
      },
      {
        title: 'Sala Daeng',        
        lat: 13.728519,
        lng: 100.534343
      },
      {
        title: 'Ratchadamri',        
        lat: 13.739339,
        lng: 100.539484
      },
      {
        title: 'Siam',        
        lat: 13.745513049345915,
        lng: 100.53455829620361
      },
      {
        title: 'National Stadium',        
        lat: 13.74651351788079,
        lng: 100.52910804748535
      }
    ];

    $scope.srtCoords = [
      {
        title: 'Phaya Thai',        
        lat: 13.756724,
        lng: 100.534963
      },
      {
        title: 'Ratchaprarop',        
        lat: 13.755152,
        lng: 100.541820
      },
      {
        title: 'Makkasan',        
        lat: 13.751062,
        lng: 100.561091
      },
      {
        lat: 13.743746,
        lng: 100.593614
      },
      {
        title: 'Ramkhamhaeng',        
        lat: 13.742947,
        lng: 100.600271
      },
      {
        title: 'Hua Mak',        
        lat: 13.737953,
        lng: 100.645332
      },
      {
        title: 'Ban Thap Chang',        
        lat: 13.732838,
        lng: 100.691457
      },
      {
        lat: 13.727573, 
        lng: 100.739254
      },
      {
        title: 'Lat Krabang',        
        lat: 13.727753,
        lng: 100.748625
      },
      {
        lat: 13.727971, 
        lng: 100.759145
      },
      {
        lat: 13.727247, 
        lng: 100.760003
      },
      {
        lat: 13.725978, 
        lng: 100.760260
      },
      {
        lat: 13.723268, 
        lng: 100.759880
      },
      {
        lat: 13.717612, 
        lng: 100.757361
      },
      {
        title: 'Suvarnabhumi',        
        lat: 13.698096,
        lng: 100.752254
      }
    ];

    $scope.srtStationsCoords = [
      {
        title: 'Phaya Thai',        
        lat: 13.756724,
        lng: 100.534963
      },
      {
        title: 'Ratchaprarop',        
        lat: 13.755152,
        lng: 100.541820
      },
      {
        title: 'Makkasan',        
        lat: 13.751062,
        lng: 100.561091
      },
      {
        title: 'Ramkhamhaeng',        
        lat: 13.742947,
        lng: 100.600271
      },
      {
        title: 'Hua Mak',        
        lat: 13.737953,
        lng: 100.645332
      },
      {
        title: 'Ban Thap Chang',        
        lat: 13.732838,
        lng: 100.691457
      },
      {
        title: 'Lat Krabang',        
        lat: 13.727753,
        lng: 100.748625
      },
      {
        title: 'Suvarnabhumi',        
        lat: 13.698096,
        lng: 100.752254
      }
    ];

    $scope.mrtCoords = [
      {
        title: 'Hua Lamphong',
        lat: 13.737719, 
        lng: 100.516851
      },
      {
        title: 'Samyan',
        lat: 13.732378, 
        lng: 100.529960
      },
      {
        title: 'Si Lom',
        lat: 13.729500, 
        lng: 100.536609
      },
      {
        title: 'Lumphini',
        lat: 13.726110, 
        lng: 100.544897
      },
      {
        title: 'Khlong Toei',
        lat: 13.722437, 
        lng: 100.553717
      },
      {
        lat: 13.720445, 
        lng: 100.559040
      },
      {
        title: 'Queen Sirikit National Convention Centre',
        lat: 13.723621, 
        lng: 100.560436
      },
      {
        lat: 13.733069, 
        lng: 100.559691
      },
      {
        lat: 13.735074, 
        lng: 100.561058
      },
      {
        title: 'Sukhumvit',
        lat: 13.738510, 
        lng: 100.561651
      },
      {
        title: 'Phetchaburi',
        lat: 13.748536, 
        lng: 100.563267
      },
      {
        title: 'Phra Ram 9',
        lat: 13.757714, 
        lng: 100.565378
      },
      {
        lat: 13.761148, 
        lng: 100.566326
      },
      {
        title: 'Thailand Cultural Centre',
        lat: 13.767363, 
        lng: 100.571201
      },
      {
        lat: 13.770172, 
        lng: 100.573140
      },
      {
        title: 'Huai Khwang',
        lat: 13.779030, 
        lng: 100.573684
      },
      {
        title: 'Sutthisan',
        lat: 13.789004, 
        lng: 100.574126
      },
      {
        title: 'Ratchadaphisek',
        lat: 13.799135, 
        lng: 100.574609
      },
      {
        lat: 13.805189, 
        lng: 100.574875
      },
      {
        title: 'Lat Phrao',
        lat: 13.806183, 
        lng: 100.573545
      },
      {
        title: 'Phahon Yothin',
        lat: 13.813687, 
        lng: 100.559956
      },
      {
        lat: 13.812517, 
        lng: 100.557785
      },
      {
        title: 'Chatuchak Park',
        lat: 13.803855, 
        lng: 100.554046
      }
    ];

    $scope.mrtStationsCoords = [
      {
        title: 'Hua Lamphong',
        lat: 13.737719, 
        lng: 100.516851
      },
      {
        title: 'Samyan',
        lat: 13.732378, 
        lng: 100.529960
      },
      {
        title: 'Si Lom',
        lat: 13.729500, 
        lng: 100.536609
      },
      {
        title: 'Lumphini',
        lat: 13.726110, 
        lng: 100.544897
      },
      {
        title: 'Khlong Toei',
        lat: 13.722437, 
        lng: 100.553717
      },
      {
        title: 'Queen Sirikit National Convention Centre',
        lat: 13.723621, 
        lng: 100.560436
      },
      {
        title: 'Sukhumvit',
        lat: 13.738510, 
        lng: 100.561651
      },
      {
        title: 'Phetchaburi',
        lat: 13.748536, 
        lng: 100.563267
      },
      {
        title: 'Phra Ram 9',
        lat: 13.757714, 
        lng: 100.565378
      },
      {
        title: 'Thailand Cultural Centre',
        lat: 13.767363, 
        lng: 100.571201
      },
      {
        title: 'Huai Khwang',
        lat: 13.779030, 
        lng: 100.573684
      },
      {
        title: 'Sutthisan',
        lat: 13.789004, 
        lng: 100.574126
      },
      {
        title: 'Ratchadaphisek',
        lat: 13.799135, 
        lng: 100.574609
      },
      {
        title: 'Lat Phrao',
        lat: 13.806183, 
        lng: 100.573545
      },
      {
        title: 'Phahon Yothin',
        lat: 13.813687, 
        lng: 100.559956
      },
      {
        title: 'Chatuchak Park',
        lat: 13.803855, 
        lng: 100.554046
      }
    ];

    $scope.brtCoords = [];

    $scope.brtStationsCoords = [
      {
        title: 'Ratchaphruek',
        lat: 13.716073, 
        lng: 100.479228
      },
      {
        title: 'Rama III Bridge',
        lat: 13.693729, 
        lng: 100.500241
      },
      {
        title: 'Charoenrat',
        lat: 13.690060, 
        lng: 100.504618
      },
      {
        title: 'Rama IX Bridge',
        lat: 13.688184, 
        lng: 100.515519
      },
      {
        title: 'Wat Dokmai',
        lat: 13.682346, 
        lng: 100.525518
      },
      {
        title: 'Wat Priwat',
        lat: 13.674548, 
        lng: 100.534659
      },
      {
        title: 'Wat Dan',
        lat: 13.674131, 
        lng: 100.543242
      },
      {
        title: 'Nararam 3',
        lat: 13.696398, 
        lng: 100.544959
      },
      {
        title: 'Thanon Chan',
        lat: 13.704861, 
        lng: 100.538822
      },
      {
        title: 'Technic Krungthep',
        lat: 13.711991, 
        lng: 100.535303
      },
      {
        title: 'Akhan Songkhro',
        lat: 13.717119, 
        lng: 100.532599
      },
      {
        title: 'Sathorn',
        lat: 13.721372, 
        lng: 100.530668
      }
    ];

    /*var symbolOne = {
      path: 'M -1,0 0,-1 1,0 0,1 z',
      strokeColor: '#F00',
      fillColor: '#F00',
      fillOpacity: 0.8,
      strokeWeight: 10
    };

    var symbolTwo = {
      path: 'M -1,0 A 1,1 0 0 0 -3,0 1,1 0 0 0 -1,0M 1,0 A 1,1 0 0 0 3,0 1,1 0 0 0 1,0M -3,3 Q 0,5 3,3',
      strokeColor: '#00F',
      rotation: 45
    };

    var symbolThree = {
      path: 'M -2,-2 2,2 M 2,-2 -2,2',
      strokeColor: '#292',
      strokeWeight: 4
    };

    $scope.icons= [
      {
        icon: symbolOne,
        offset: '0%'
      },
      {
        icon: symbolOne,
        offset: '100%'
      }
    ];*/

    /*var btsPath = new google.maps.Polyline({
      path: btsPath,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.4,
      strokeWeight: 15,
      map: ctrl.map,
      icons: [
        {
          icon: symbolOne,
          offset: '0%'
        },
        {
          icon: symbolOne,
          offset: '50%'
        }
      ]
    });*/

    function generateBtsMarkers(stations, pin) {
      for(var station in stations) {
        var customIcon = {
          scaledSize: new google.maps.Size(30, 30),//[25, 25],
          anchor: new google.maps.Point(15, 15),
          url: pin
        };
        var mrk = new google.maps.Marker({
          title: stations[station].title,
          //label: 'BTS',
          icon: customIcon,
          position: new google.maps.LatLng(stations[station].lat, stations[station].lng),
          map: ctrl.map
        });
      }
    }

    function setMap() {
      var bounds = ctrl.map.getBounds();
      var fr = bounds.getNorthEast();
      var nl = bounds.getSouthWest();
      var nlLat = nl.lat();
      var nlLng = nl.lng();
      var frLat = fr.lat();
      var frLng = fr.lng();
      var listingType = $scope.listingFilter; //'rent,sale';
      var propertyTypes = 'co,th,dh,ap';

      var styles = [{
        url: 'img/m1.png',
        height: 40,
        width: 40,
        textColor: 'white'/*,
        anchor: [5,5],
        textSize: 15,
        backgroundPosition: 'center',
        iconAnchor: [5,5]*/
      }];
      var mcOptions = {
        gridSize: 40, 
        maxZoom: 15, 
        styles: styles
      };
      condoApi.getCondoList(nlLat, nlLng, frLat, frLng, listingType, propertyTypes).then(function(condoList) {
        //$scope.imageList = [];
        $scope.rentCount = 0;
        $scope.saleCount = 0;
        $scope.condoList = condoList.properties;
        for (var i = 0; i < $scope.condoList.length; i++) {
          createMarker($scope.condoList[i]);
          if($scope.condoList[i].listing_type === 'rent')
            $scope.rentCount++;
          else
            $scope.saleCount++;
        }
        if(mc != null) { 
          mc.clearMarkers();  
        } else {
          mc = new MarkerClusterer(ctrl.map, null, mcOptions);
        }
        mc.addMarkers($scope.markers, false);
        $scope.markers = [];
      });
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
      for (var i = 0; i < $scope.markers.length; i++) {
        $scope.markers[i].setMap(map);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
      setMapOnAll(ctrl.map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
      clearMarkers();
      $scope.markers = [];
    }

    function createMarker(info){
      //$scope.imageList.push(info.images[0]);
      var marker = new google.maps.Marker({
        id: info.id,
        icon: 'img/bluepin.png', //icon: 'https://www.google.com/intl/en_us/mapfiles/ms/icons/yellow.png', //icon: $scope.image,
        position: new google.maps.LatLng(info.lat, info.lng),
        //map: ctrl.map,
        title: info.property_name
      });
      var infowindow =  new google.maps.InfoWindow({
        content: '',
        maxWidth: 170,
        maxHeight: 115
      });
      google.maps.event.addListener(marker, 'mouseover', function(){ //'click'
        $scope.name = info.property_name;
        //$scope.location = info.location;
        $scope.location = capitalizeFirstLetter(info.property_type) + " - For " + capitalizeFirstLetter(info.listing_type);
        $scope.activeImage = info.images[0]; //'img/house.jpg';
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
      $scope.markers.push(marker);
    }
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
    function _getCondoList(nlLat, nlLng, frLat, frLng, listingType, propertyTypes) {
      var d = $q.defer();
      //$http.get('http://tfh.ladargroup.com/rest/search/condo?nl=13,100&fr=14,101').then(function(response) {
      $http.get('http://tfh.ladargroup.com/rest/search/property?nl=' 
                + nlLat
                + ',' 
                + nlLng 
                + '&fr='
                + frLat
                + ','
                + frLng
                + '&lt='
                + listingType
                + '&pt='
                + propertyTypes).then(function(response) {
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