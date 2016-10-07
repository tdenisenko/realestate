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

    var init = function() {
      $scope.googleMapsUrl='https://maps.googleapis.com/maps/api/js?key=AIzaSyC9efZV5sak_Geyb6y7UMSfAaNt7fFUcfM';
      $scope.markers = [];
      $scope.btsMarkers = [];
      //$scope.imageList = [];
      $scope.name = '';
      $scope.location = '';
      $scope.price = '';
      $scope.limit = 10000;
      $scope.loading = true;
      $scope.listingFilter = 'rent,sale';
      $scope.listingOptions = {
        isForRent: true,
        isForSale: true
      };
      $scope.minPrice = '';
      $scope.maxPrice = '';
      $scope.beds = 0;
      $scope.baths = 0;
      $scope.minSize = '';
      $scope.maxSize = '';
      $scope.minYear = '';
      $scope.maxYear = '';
      $scope.moreOptions = {
        bedOptions: 
        [
          {
            label: '0+',
            value: 0
          },
          {
            label: '1+',
            value: 1
          },
          {
            label: '2+',
            value: 2
          },
          {
            label: '3+',
            value: 3
          },
          {
            label: '4+',
            value: 4
          },
          {
            label: '5+',
            value: 5
          },
          {
            label: '6+',
            value: 6
          }
        ],
        bathOptions: 
        [
          {
            label: '0+',
            value: 0
          },
          {
            label: '1+',
            value: 1
          },
          {
            label: '2+',
            value: 2
          },
          {
            label: '3+',
            value: 3
          },
          {
            label: '4+',
            value: 4
          },
          {
            label: '5+',
            value: 5
          },
          {
            label: '6+',
            value: 6
          }
        ]
      }
      $scope.rentCount = 0;
      $scope.saleCount = 0;
      $scope.searchText = '';
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
          title: 'Sanam Pao Station',        
          lat: 13.772369,
          lng: 100.542031
        },
        {
          title: 'Ari Station',        
          lat: 13.779785,
          lng: 100.544700
        },
        {
          title: 'Saphan Khwai Station',        
          lat: 13.793650,
          lng: 100.549688
        },
        {
          lat: 13.798452, 
          lng: 100.551398
        },
        {
          title: 'Mo Chit Station',        
          lat: 13.802442,
          lng: 100.553753
        }
      ];
      $scope.btsCoords2 = [
        {
          title: 'National Stadium Station',        
          lat: 13.74651351788079,
          lng: 100.52910804748535
        },
        {
          title: 'Siam Station',        
          lat: 13.745513049345915,
          lng: 100.53455829620361
        },
        {
          lat: 13.744484, 
          lng: 100.540383
        },
        {
          title: 'Ratchadamri Station',        
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
          title: 'Sala Daeng Station',        
          lat: 13.728519,
          lng: 100.534343
        },
        {
          lat: 13.726150, 
          lng: 100.528149
        },
        {
          title: 'Chong Nonsi Station',        
          lat: 13.723725,
          lng: 100.529477
        },
        {
          lat: 13.721891, 
          lng: 100.530242
        },
        {
          title: 'Surasak Station',        
          lat: 13.719281,
          lng: 100.521616
        },
        {
          lat: 13.717947, 
          lng: 100.517160
        },
        {
          title: 'Saphan Taksin Station',        
          lat: 13.718752,
          lng: 100.514146
        },
        {
          lat: 13.720822, 
          lng: 100.505685
        },
        {
          title: 'Krung Thon Buri Station',        
          lat: 13.720894,
          lng: 100.502900
        },
        {
          title: 'Wongwian Yai Station',        
          lat: 13.721020,
          lng: 100.495298
        },
        {
          title: 'Pho Nimit Station',        
          lat: 13.719192,
          lng: 100.485934
        },
        {
          title: 'Talat Phlu Station',        
          lat: 13.714247,
          lng: 100.476719
        },
        {
          lat: 13.711970, 
          lng: 100.472610
        },
        {
          title: 'Wutthakat Station',        
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
          title: 'Bang Wa Station',        
          lat: 13.720698,
          lng: 100.457803
        }
      ];
      $scope.btsStationsCoords1 = [
        {
          title: 'Bearing Station',
          lat: 13.661229108173657,
          lng: 100.60193538665771
        },
        {
          title: 'Bang Na Station',        
          lat: 13.66815141121943,
          lng: 100.60466051101685
        },
        {
          title: 'Udom Suk Station',        
          lat: 13.679931368972557,
          lng: 100.60957431793213
        },
        {
          title: 'Punnawithi Station',        
          lat: 13.689313214516257,
          lng: 100.60901641845703
        },
        {
          title: 'Bang Chak Station',        
          lat: 13.696651641782516,
          lng: 100.60549736022949
        },
        {
          title: 'On Nut Station',        
          lat: 13.705574193616373,
          lng: 100.60103416442871
        },
        {
          title: 'Phra Khanong Station',        
          lat: 13.715246857655304,
          lng: 100.59120655059814
        },
        {
          title: 'Ekkamai Station',        
          lat: 13.71958275011919,
          lng: 100.58524131774902
        },
        {
          title: 'Thong Lo Station',        
          lat: 13.724252083187412,
          lng: 100.57863235473633
        },
        {
          title: 'Phrom Phong Station',        
          lat: 13.730463819728453,
          lng: 100.56970596313477
        },
        {
          title: 'Asok Station',        
          lat: 13.737008894291328,
          lng: 100.56035041809082
        },
        {
          title: 'Nana Station',        
          lat: 13.740552329741211,
          lng: 100.55541515350342
        },
        {
          title: 'Phloen Chit Station',        
          lat: 13.743053546032764,
          lng: 100.5488920211792
        },
        {
          title: 'Chit Lom Station',        
          lat: 13.744137398132912,
          lng: 100.5430555343628
        },
        {
          title: 'Siam Station',        
          lat: 13.745513049345915,
          lng: 100.53455829620361
        },
        {
          title: 'Ratchatewi Station',        
          lat: 13.751655,
          lng: 100.531568
        },
        {
          title: 'Phaya Thai Station',        
          lat: 13.756818,
          lng: 100.533776
        },
        {
          title: 'Victory Monument Station',        
          lat: 13.762761,
          lng: 100.537079
        },
        {
          title: 'Sanam Pao Station',        
          lat: 13.772369,
          lng: 100.542031
        },
        {
          title: 'Ari Station',        
          lat: 13.779785,
          lng: 100.544700
        },
        {
          title: 'Saphan Khwai Station',        
          lat: 13.793650,
          lng: 100.549688
        },
        {
          title: 'Mo Chit Station',        
          lat: 13.802442,
          lng: 100.553753
        }
      ];
      $scope.btsStationsCoords2 = [
        {
          title: 'Bang Wa Station',        
          lat: 13.720698,
          lng: 100.457803
        },
        {
          title: 'Wutthakat Station',        
          lat: 13.713094,
          lng: 100.468717
        },
        {
          title: 'Talat Phlu Station',        
          lat: 13.714247,
          lng: 100.476719
        },
        {
          title: 'Pho Nimit Station',        
          lat: 13.719192,
          lng: 100.485934
        },
        {
          title: 'Wongwian Yai Station',        
          lat: 13.721020,
          lng: 100.495298
        },
        {
          title: 'Krung Thon Buri Station',        
          lat: 13.720894,
          lng: 100.502900
        },
        {
          title: 'Saphan Taksin Station',        
          lat: 13.718752,
          lng: 100.514146
        },
        {
          title: 'Surasak Station',        
          lat: 13.719281,
          lng: 100.521616
        },
        {
          title: 'Chong Nonsi Station',        
          lat: 13.723725,
          lng: 100.529477
        },
        {
          title: 'Sala Daeng Station',        
          lat: 13.728519,
          lng: 100.534343
        },
        {
          title: 'Ratchadamri Station',        
          lat: 13.739339,
          lng: 100.539484
        },
        {
          title: 'Siam Station',        
          lat: 13.745513049345915,
          lng: 100.53455829620361
        },
        {
          title: 'National Stadium Station',        
          lat: 13.74651351788079,
          lng: 100.52910804748535
        }
      ];
      $scope.srtCoords = [
        {
          title: 'Phaya Thai Station',        
          lat: 13.756724,
          lng: 100.534963
        },
        {
          title: 'Ratchaprarop Station',        
          lat: 13.755152,
          lng: 100.541820
        },
        {
          title: 'Makkasan Station',        
          lat: 13.751062,
          lng: 100.561091
        },
        {
          lat: 13.743746,
          lng: 100.593614
        },
        {
          title: 'Ramkhamhaeng Station',        
          lat: 13.742947,
          lng: 100.600271
        },
        {
          title: 'Hua Mak Station',        
          lat: 13.737953,
          lng: 100.645332
        },
        {
          title: 'Ban Thap Chang Station',        
          lat: 13.732838,
          lng: 100.691457
        },
        {
          lat: 13.727573, 
          lng: 100.739254
        },
        {
          title: 'Lat Krabang Station',        
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
          title: 'Suvarnabhumi Station',        
          lat: 13.698096,
          lng: 100.752254
        }
      ];
      $scope.srtStationsCoords = [
        {
          title: 'Phaya Thai Station',        
          lat: 13.756724,
          lng: 100.534963
        },
        {
          title: 'Ratchaprarop Station',        
          lat: 13.755152,
          lng: 100.541820
        },
        {
          title: 'Makkasan Station',        
          lat: 13.751062,
          lng: 100.561091
        },
        {
          title: 'Ramkhamhaeng Station',        
          lat: 13.742947,
          lng: 100.600271
        },
        {
          title: 'Hua Mak Station',        
          lat: 13.737953,
          lng: 100.645332
        },
        {
          title: 'Ban Thap Chang Station',        
          lat: 13.732838,
          lng: 100.691457
        },
        {
          title: 'Lat Krabang Station',        
          lat: 13.727753,
          lng: 100.748625
        },
        {
          title: 'Suvarnabhumi Station',        
          lat: 13.698096,
          lng: 100.752254
        }
      ];
      $scope.mrtCoords = [
        {
          title: 'Hua Lamphong Station',
          lat: 13.737719, 
          lng: 100.516851
        },
        {
          title: 'Samyan Station',
          lat: 13.732378, 
          lng: 100.529960
        },
        {
          title: 'Si Lom Station',
          lat: 13.729500, 
          lng: 100.536609
        },
        {
          title: 'Lumphini Station',
          lat: 13.726110, 
          lng: 100.544897
        },
        {
          title: 'Khlong Toei Station',
          lat: 13.722437, 
          lng: 100.553717
        },
        {
          lat: 13.720445, 
          lng: 100.559040
        },
        {
          title: 'Queen Sirikit National Convention Centre Station',
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
          title: 'Sukhumvit Station',
          lat: 13.738510, 
          lng: 100.561651
        },
        {
          title: 'Phetchaburi Station',
          lat: 13.748536, 
          lng: 100.563267
        },
        {
          title: 'Phra Ram 9 Station',
          lat: 13.757714, 
          lng: 100.565378
        },
        {
          lat: 13.761148, 
          lng: 100.566326
        },
        {
          title: 'Thailand Cultural Centre Station',
          lat: 13.767363, 
          lng: 100.571201
        },
        {
          lat: 13.770172, 
          lng: 100.573140
        },
        {
          title: 'Huai Khwang Station',
          lat: 13.779030, 
          lng: 100.573684
        },
        {
          title: 'Sutthisan Station',
          lat: 13.789004, 
          lng: 100.574126
        },
        {
          title: 'Ratchadaphisek Station',
          lat: 13.799135, 
          lng: 100.574609
        },
        {
          lat: 13.805189, 
          lng: 100.574875
        },
        {
          title: 'Lat Phrao Station',
          lat: 13.806183, 
          lng: 100.573545
        },
        {
          title: 'Phahon Yothin Station',
          lat: 13.813687, 
          lng: 100.559956
        },
        {
          lat: 13.812517, 
          lng: 100.557785
        },
        {
          title: 'Chatuchak Park Station',
          lat: 13.803855, 
          lng: 100.554046
        }
      ];
      $scope.mrtStationsCoords = [
        {
          title: 'Hua Lamphong Station',
          lat: 13.737719, 
          lng: 100.516851
        },
        {
          title: 'Samyan Station',
          lat: 13.732378, 
          lng: 100.529960
        },
        {
          title: 'Si Lom Station',
          lat: 13.729500, 
          lng: 100.536609
        },
        {
          title: 'Lumphini Station',
          lat: 13.726110, 
          lng: 100.544897
        },
        {
          title: 'Khlong Toei Station',
          lat: 13.722437, 
          lng: 100.553717
        },
        {
          title: 'Queen Sirikit National Convention Centre Station',
          lat: 13.723621, 
          lng: 100.560436
        },
        {
          title: 'Sukhumvit Station',
          lat: 13.738510, 
          lng: 100.561651
        },
        {
          title: 'Phetchaburi Station',
          lat: 13.748536, 
          lng: 100.563267
        },
        {
          title: 'Phra Ram 9 Station',
          lat: 13.757714, 
          lng: 100.565378
        },
        {
          title: 'Thailand Cultural Centre Station',
          lat: 13.767363, 
          lng: 100.571201
        },
        {
          title: 'Huai Khwang Station',
          lat: 13.779030, 
          lng: 100.573684
        },
        {
          title: 'Sutthisan Station',
          lat: 13.789004, 
          lng: 100.574126
        },
        {
          title: 'Ratchadaphisek Station',
          lat: 13.799135, 
          lng: 100.574609
        },
        {
          title: 'Lat Phrao Station',
          lat: 13.806183, 
          lng: 100.573545
        },
        {
          title: 'Phahon Yothin Station',
          lat: 13.813687, 
          lng: 100.559956
        },
        {
          title: 'Chatuchak Park Station',
          lat: 13.803855, 
          lng: 100.554046
        }
      ];
      $scope.brtCoords = [];
      $scope.brtStationsCoords = [
        {
          title: 'Ratchaphruek Station',
          lat: 13.716073, 
          lng: 100.479228
        },
        {
          title: 'Rama III Bridge Station',
          lat: 13.693729, 
          lng: 100.500241
        },
        {
          title: 'Charoenrat Station',
          lat: 13.690060, 
          lng: 100.504618
        },
        {
          title: 'Rama IX Bridge Station',
          lat: 13.688184, 
          lng: 100.515519
        },
        {
          title: 'Wat Dokmai Station',
          lat: 13.682346, 
          lng: 100.525518
        },
        {
          title: 'Wat Priwat Station',
          lat: 13.674548, 
          lng: 100.534659
        },
        {
          title: 'Wat Dan Station',
          lat: 13.674131, 
          lng: 100.543242
        },
        {
          title: 'Nararam 3 Station',
          lat: 13.696398, 
          lng: 100.544959
        },
        {
          title: 'Thanon Chan Station',
          lat: 13.704861, 
          lng: 100.538822
        },
        {
          title: 'Technic Krungthep Station',
          lat: 13.711991, 
          lng: 100.535303
        },
        {
          title: 'Akhan Songkhro Station',
          lat: 13.717119, 
          lng: 100.532599
        },
        {
          title: 'Sathorn Station',
          lat: 13.721372, 
          lng: 100.530668
        }
      ];
      $scope.allStations = []
      .concat($scope.btsStationsCoords1)
      .concat($scope.btsStationsCoords2)
      .concat($scope.mrtStationsCoords)
      .concat($scope.srtStationsCoords);
      $scope.allStations = arrayUnique($scope.allStations);
      /*$scope.search = function (searchText) {
        if (!searchText || searchText === '') {
          return;
        }
        var station = _.find($scope.allStations, function(s) { return s.title === searchText; });
        var center = function() {
          ctrl.map.panTo(station);
        }
        var zoom = function() {
          var level = ctrl.map.getZoom();
          smoothZoom(ctrl.map, 18, level);
        }
        $timeout(center).then(zoom);
      };*/
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
        $timeout(setMap, 1000).then(function() {
          loading();
        });
      }
      $scope.applyChanges = function() {
        loading();
        //Price check
        if (!validate($scope.minPrice, 0, 100000000) || ($scope.maxPrice !== '' && $scope.minPrice > $scope.maxPrice)) {
          $scope.minPrice = '';
        }
        if (!validate($scope.maxPrice, 0, 100000000) || ($scope.minPrice !== '' && $scope.maxPrice < $scope.minPrice)) {
          $scope.maxPrice = '';
        }
        //Size check
        if (!validate($scope.minSize, 0, 100000000) || ($scope.maxSize !== '' && $scope.minSize > $scope.maxSize)) {
          $scope.minSize = '';
        }
        if (!validate($scope.maxSize, 0, 100000000) || ($scope.minSize !== '' && $scope.maxSize < $scope.minSize)) {
          $scope.maxSize = '';
        }
        //Year check
        if (!validate($scope.minYear, 1000, 2100) || ($scope.maxYear !== '' && $scope.minYear > $scope.maxYear)) {
          $scope.minYear = '';
        }
        if (!validate($scope.maxYear, 1000, 2100) || ($scope.minYear !== '' && $scope.maxYear < $scope.minYear)) {
          $scope.maxYear = '';
        }
        //console.log("changes applied");
        $timeout(setMap, 1000).then(function() {
          loading();
        });
      }
      $scope.zoomTo = function(type) {
        if (!(ctrl && ctrl.map)) {
          return;
        }
        if (type === 'bts') {
          var center = function() {
            ctrl.map.panTo({lat: 13.745, lng: 100.545});
          }
          var zoom = function() {
            var level = ctrl.map.getZoom();
            smoothZoom(ctrl.map, 16, level);
          }
          $timeout(center).then(zoom);
        } else if (type === 'mrt') {
          var center = function() {
            ctrl.map.panTo({lat: 13.8, lng: 100.56});
          }
          var zoom = function() {
            var level = ctrl.map.getZoom();
            smoothZoom(ctrl.map, 16, level);
          }
          $timeout(center).then(zoom);
        } else if (type === 'arl') {
          var center = function() {
            ctrl.map.panTo({lat: 13.745, lng: 100.568});
          }
          var zoom = function() {
            var level = ctrl.map.getZoom();
            smoothZoom(ctrl.map, 15, level);
          }
          $timeout(center).then(zoom);
        }
      }
    }();

    function validate(str, min, max) {
      var n = parseFloat(str);
      return (!isNaN(n) && n >= min && n <= max);
    }

    function smoothZoom (map, max, cnt) {
        if (cnt >= max) {
            map.setZoom(max - 1);
            return;
        }
        else {
            $scope.z = google.maps.event.addListener(map, 'zoom_changed', function(event){
                google.maps.event.removeListener($scope.z);
                smoothZoom(map, max, cnt + 1);
            });
            setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
        }
    } 

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function loading() { 
      $scope.loading = !$scope.loading;
    }

    var ctrl = this;
    var mc = null;

    var input = document.getElementById('srch-term');
    var searchBox = new google.maps.places.SearchBox(input);

    NgMap.getMap().then(function(map){
      ctrl.map = map;
      /*generateBtsMarkers($scope.btsStationsCoords1, 'img/pin-for-bts.png');
      generateBtsMarkers($scope.btsStationsCoords2, 'img/pin-for-transportation.png');
      generateBtsMarkers($scope.srtStationsCoords, 'img/pin-for-arl.png');
      generateBtsMarkers($scope.mrtStationsCoords, 'img/pin-for-arl.png');
      generateBtsMarkers($scope.brtStationsCoords, 'img/pin-for-bts.png');*/
      
      //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      var timeout = $timeout(setMap).then(loading);
      var status = 'undone';
      ctrl.map.addListener('bounds_changed', function() {
        //loading sign for details here
        if (status === 'undone') {
          $timeout(loading);
          searchBox.setBounds(ctrl.map.getBounds());
          timeout = $timeout(setMap, 1000);
          status = 'done';
          timeout.then(function() {
            status = 'undone';
            $timeout(loading);
          });
        }
      });
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            return;
          }

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    });

    function arrayUnique(array) {
        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i].title === a[j].title)
                    a.splice(j--, 1);
            }
        }

        return a;
    }

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
      var minPrice = $scope.minPrice === '' ? 0 : $scope.minPrice;
      var maxPrice = $scope.maxPrice === '' ? 0 : $scope.maxPrice;
      var beds = $scope.beds;
      var baths = $scope.baths;
      var minSize = $scope.minSize === '' ? 0 : $scope.minSize;
      var maxSize = $scope.maxSize === '' ? 0 : $scope.maxSize;
      var minYear = $scope.minYear === '' ? 0 : $scope.minYear;
      var maxYear = $scope.maxYear === '' ? 0 : $scope.maxYear;

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
      condoApi.getCondoList(nlLat, nlLng, frLat, frLng, listingType, propertyTypes, minPrice, maxPrice, beds, baths, minSize, maxSize, minYear, maxYear).then(function(condoList) {
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
        $scope.price = info.details.listing_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                              + '&#3647;{{price}}'
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
    function _getCondoList(nlLat, nlLng, frLat, frLng, listingType, propertyTypes, minPrice, maxPrice, beds, baths, minSize, maxSize, minYear, maxYear) {
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
                + propertyTypes
                + '&price_min='
                + minPrice
                + '&price_max='
                + maxPrice
                + '&bed='
                + beds
                + '&bath='
                + baths
                + '&size_min='
                + minSize
                + '&size_max='
                + maxSize
                + '&year_min='
                + minYear
                + '&year_max='
                + maxYear).then(function(response) {
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