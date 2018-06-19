"use strict";

var sliderApp = angular.module('sliderApp',['ngAnimate','ui.openseadragon']);

sliderApp.controller('SliderController', function ($scope) {
    $scope.images=[{src:'img1.png',title:'Pic 1'},{src:'img2.png',title:'Pic 2'},{src:'img3.png',title:'Pic 3'},{src:'img4.png',title:'Pic 4'},{src:'img5.png',title:'Pic 5'}];
    $scope.currentIndex =0;
    $scope.hd = [true,true,true,true,true];
    $scope.counter =0;
    $scope.getImage = function (image,index) {
        if(!$scope.hd[index])
            return 'hd/'+image;
        else
        return 'img/' + image;
    };

    $scope.getHD = function(index){
        $scope.hd[index] = false;
    };

    $scope.getIndex = function(index){
        return $scope.hd[index];
    };

    $scope.checked = true;

    $scope.showHD = function (event,index,image) {
        $scope.hd[index] = false;
        var imgElement = event.target;
        var parent = imgElement.parentElement;
        var url = '/Merge/hd/'+image;

        parent.innerHTML = '';
        // parent.htmlcode = ('');
        OpenSeadragon({
            element: parent,
            prefixUrl: '/Merge/openseadragon/images/',
            autoResize: true,
            showFullPageControl: false,
            defaultZoomLevel: 1,
            minZoomLevel: 1,
            visibilityRatio: 1,
            tileSources: {
                type: 'image',
                url: url
            }

        });
        $scope.checked = false;
        // imgElement.hide();
        // parent.siblings().remove();
    }

});



sliderApp.directive('slider', function ($document) {
    return{

        restrict: 'AE',
        replace: true,
        $scope:{
            images: '='
        },
        link: function ($scope) {

              $scope.next=function () {
             $scope.currentIndex<$scope.images.length-1?$scope.currentIndex++:$scope.currentIndex=0;
            };

           $scope.prev=function () {
               $scope.currentIndex>0?$scope.currentIndex--:$scope.currentIndex=$scope.images.length-1;
            };

           $scope.change=function (index){
               $scope.currentIndex=index;
           //    console.log($scope.currentIndex);
            };

           $scope.$watch('currentIndex',function (){
               $scope.images.forEach(function (image) {
                   image.visible=false;
                });
               $scope.images[$scope.currentIndex].visible=true;

            });

        },
        templateUrl: 'templates/templateurl.html'
    }
});

sliderApp.directive('zoom', function($window) {

    function link( scope, element, attrs) {

        //SETUP

        var frame, image, zoomlvl, fWidth, fHeight, rect, rootDoc, offsetL, offsetT, xPosition, yPosition, pan;
        //Template has loaded, grab elements.
        scope.$watch('$viewContentLoaded', function()
        {
            frame = angular.element(document.querySelector("#"+scope.frame))[0];
            image = angular.element(document.querySelector("#"+scope.img))[0];

            zoomlvl = (scope.zoomlvl === undefined) ? "2.5" : scope.zoomlvl
        });



        //MOUSE TRACKER OVER IMG
        scope.trackMouse = function($event) {
            console.log(scope.hdc);
             if(scope.hdc === "true") {
                 frame = angular.element(document.querySelector("#" + scope.frame))[0];
                 image = angular.element(document.querySelector("#" + scope.img))[0];

                 fWidth = frame.clientWidth;
                 fHeight = frame.clientHeight;

                 rect = frame.getBoundingClientRect();
                 rootDoc = frame.ownerDocument.documentElement;

                 //calculate the offset of the frame from the top and left of the document
                 offsetT = rect.top + $window.pageYOffset - rootDoc.clientTop
                 offsetL = rect.left + $window.pageXOffset - rootDoc.clientLeft

                 //calculate current cursor position inside the frame, as a percentage
                 xPosition = (($event.pageX - offsetL) / fWidth) * 60
                 yPosition = (($event.pageY - offsetT) / fHeight) * 60

                 pan = xPosition + "% " + yPosition + "% 0";
                 image.style.transformOrigin = pan;
             }

        }

        //MOUSE OVER | ZOOM-IN
        element.on('mouseover', function(event) {
            if(scope.hdc === "true") {
            frame = angular.element(document.querySelector("#"+scope.frame))[0];
            image = angular.element(document.querySelector("#"+scope.img))[0];
            image.style.transform = 'scale('+zoomlvl+')'
            }
        })

        //MOUSE OUT | ZOOM-OUT
        element.on('mouseout', function(event) {
            if(scope.hdc === "true") {
                frame = angular.element(document.querySelector("#" + scope.frame))[0];
                image = angular.element(document.querySelector("#" + scope.img))[0];
                image.style.transform = 'scale(1)'
            }
        })


    }

    return {
        restrict: 'EA',
        scope: {
            src: '@src',
            frame: '@frame',
            img: '@img',
            zoomlvl: '@zoomlvl',
            index: '@index',
            hdc:'@hdc'
        },
        template: [
            '<div id="{{ frame }}" class="zoomPanFrame" >',
            '<img id="{{ img }}" class="zoomPanImage" ng-src= "{{ src }}" ng-mousemove="trackMouse($event)">',
            '</img>',
            '</div>'
        ].join(''),
        link: link
    };
});