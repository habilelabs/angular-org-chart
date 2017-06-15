app.directive('orgChart', function () {
    return {
        restrict: 'AE',
        scope: {
            orgOptions: '=',
            onChange : '&'
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            $(element).orgchart(scope.orgOptions)
                .children('.orgchart').on('nodedropped.orgchart', function (event) {

                    console.log('draggedNode:' + event.draggedNode.children('.title').text(), event.draggedNode.attr('id')
                        + ', dragZone:' + event.dragZone.children('.title').text(), event.dragZone.attr('id')
                        + ', dropZone:' + event.dropZone.children('.title').text(), event.dropZone.attr('id'));


                    var tree = $(element).orgchart('getHierarchy');
                    scope.onChange({hierarchy : tree});
                });
        },
        controller : function() {

        }
    };
});