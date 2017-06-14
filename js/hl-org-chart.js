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
                    /*ngModelCtrl.$modelValue = tree;
                    scope.ngModel = tree;*/
                    console.log(tree);
                    scope.onChange({hierarchy : tree});
                }).on('click', '.node', function () {
                    var $this = $(this);
                    console.log("$this.find('.title').text()", $this.find('.title').text());
                    $('#selected-node').val($this.find('.title').text()).data('node', $this);
                });
        }
    };
});