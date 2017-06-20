app.directive('orgChart', function () {
    return {
        restrict: 'AE',
        scope: {
            orgOptions: '=',
            onChange : '&',
            onNodeClick : "=",
            node  : "="
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            var option = {};

            for(key in scope.orgOptions) {
                option[key] = angular.copy(scope.orgOptions[key]);
            }

            if(scope.orgOptions.draggable) {
                option.dropCriteria = dragbble;
                option.draggable = true;
            }
            if(scope.orgOptions.isEditable) {
                option.createNode = scope.orgOptions.createNode ? scope.orgOptions.createNode : createNode;
            }
            var getId = function() {
                return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
            };
            function createNode($node, data) {
                $node[0].id = getId();
                var secondMenuIcon = $('<i>', {
                    'class': 'fa '+   +' second-menu-icon',
                    click: function() {
                        scope.onNodeClick(data);
                        scope.$apply(function() {
                            scope.node = data;
                            scope.node.newNodeList = [{'name' : ''}];
                        });

                        $(this).siblings('.second-menu').toggle();
                    }
                });
                var secondMenu = '<div class="second-menu"></div>';
                $node.append(secondMenuIcon).append(secondMenu);
            }
            function dragbble($draggedNode, $dragZone, $dropZone) {
                if ($draggedNode.find('.content').text().indexOf(scope.orgOptions.draggable.parent) > -1 && $dropZone.find('.content').text().indexOf(scope.orgOptions.draggable.child) > -1) {
                    return false;
                }
                return true;
            }
            $(element).orgchart(option)
                .children('.orgchart').on('nodedropped.orgchart', function (event) {
                    console.log('draggedNode:' + event.draggedNode.children('.title').text(), event.draggedNode.attr('id')
                    + ', dragZone:' + event.dragZone.children('.title').text(), event.dragZone.attr('id')
                    + ', dropZone:' + event.dropZone.children('.title').text(), event.dropZone.attr('id'));
                    var tree = $(element).orgchart('getHierarchy');
                    scope.onChange({hierarchy : tree});
                })
                .on('click', '.node', function() {
                    var $this = $(this);
                    $('#selected-node').val($this.find('.title').text()).data('node', $this);
                })
                .on('click', '.orgchart', function(event) {
                    if (!$(event.target).closest('.node').length) {
                        $('#selected-node').val('');
                    }
                });
        },
        controller : function() {
            var getId = function() {
                return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
            };

            $('input[name="chart-state"]').on('click', function() {
                $('.orgchart').toggleClass('view-state', this.value !== 'view');
                $('#edit-panel').toggleClass('view-state', this.value === 'view');
                if ($(this).val() === 'edit') {
                    $('.orgchart').find('tr').removeClass('hidden')
                        .find('td').removeClass('hidden')
                        .find('.node').removeClass('slide-up slide-down slide-right slide-left');
                } else {
                    $('#btn-reset').trigger('click');
                }
            });

            $('input[name="node-type"]').on('click', function() {
                var $this = $(this);
                if ($this.val() === 'parent') {
                    $('#edit-panel').addClass('edit-parent-node');
                    $('#new-nodelist').children(':gt(0)').remove();
                } else {
                    $('#edit-panel').removeClass('edit-parent-node');
                }
            });
        }
    };
});
