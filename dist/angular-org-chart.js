app.directive('orgChart', function () {
    return {
        restrict: 'AE',
        scope: {
            orgOptions: '=',
            onChange : '&',
            onEdit : "=",
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
                    'class': 'fa fa-info-circle second-menu-icon',
                    click: function() {
                        scope.onEdit(data);
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

            /*$('#btn-add-input').on('click', function() {
                $('#new-nodelist').append('<li><input type="text" class="new-node"></li>');
            });
*/
          /*  $('#btn-remove-input').on('click', function() {
                var inputs = $('#new-nodelist').children('li');
                if (inputs.length > 1) {
                    inputs.last().remove();
                }
            });
*/
            /*$('#btn-add-nodes').on('click', function() {
                var $chartContainer = $('#chart-container');
                var nodeVals = [];
                $('#new-nodelist').find('.new-node').each(function(index, item) {
                    var validVal = item.value.trim();
                    if (validVal.length) {
                        nodeVals.push(validVal);
                    }
                });*/
     /*           var $node = $('#selected-node').data('node');
                if (!nodeVals.length) {
                    alert('Please input value for new node');
                    return;
                }
                var nodeType = $('input[name="node-type"]:checked');
                if (!nodeType.length) {
                    alert('Please select a node type');
                    return;
                }
                if (nodeType.val() !== 'parent' && !$('.orgchart').length) {
                    alert('Please creat the root node firstly when you want to build up the orgchart from the scratch');
                    return;
                }
                if (nodeType.val() !== 'parent' && !$node) {
                    alert('Please select one node in orgchart');
                    return;
                }
                if (nodeType.val() === 'parent') {
                    if (!$chartContainer.children().length) {// if the original chart has been deleted
                        $chartContainer.orgchart({
                            'data' : { 'name': nodeVals[0] },
                            'exportButton': true,
                            'exportFilename': 'SportsChart',
                            'parentNodeSymbol': 'fa-th-large',
                            'createNode': function($node, data) {
                                $node[0].id = getId();
                            }
                        })
                            .find('.orgchart').addClass('view-state');
                    } else {
                        $chartContainer.orgchart('addParent', $chartContainer.find('.node:first'), { 'name': nodeVals[0], 'Id': getId() });
                    }
                } else if (nodeType.val() === 'siblings') {
                    $chartContainer.orgchart('addSiblings', $node,
                        { 'siblings': nodeVals.map(function(item) { return { 'name': item, 'relationship': '110', 'Id': getId() }; })
                        });
                } else {
                    var hasChild = $node.parent().attr('colspan') > 0 ? true : false;
                    if (!hasChild) {
                        var rel = nodeVals.length > 1 ? '110' : '100';
                        $chartContainer.orgchart('addChildren', $node, {
                            'children': nodeVals.map(function(item) {
                                return { 'name': item, 'relationship': rel, 'Id': getId() };
                            })
                        }, $.extend({}, $chartContainer.find('.orgchart').data('options'), { depth: 0 }));
                    } else {
                        $chartContainer.orgchart('addSiblings', $node.closest('tr').siblings('.nodes').find('.node:first'),
                            { 'siblings': nodeVals.map(function(item) { return { 'name': item, 'relationship': '110', 'Id': getId() }; })
                            });
                    }
                }
            });*/

           /* $('#btn-delete-nodes').on('click', function() {
                var $node = $('#selected-node').data('node');
                if (!$node) {
                    alert('Please select one node in orgchart');
                    return;
                } else if ($node[0] === $('.orgchart').find('.node:first')[0]) {
                    if (!window.confirm('Are you sure you want to delete the whole chart?')) {
                        return;
                    }
                }
                $('#chart-container').orgchart('removeNodes', $node);
                $('#selected-node').val('').data('node', null);
            });

            $('#btn-reset').on('click', function() {
                $('.orgchart').find('.focused').removeClass('focused');
                $('#selected-node').val('');
                $('#new-nodelist').find('input:first').val('').parent().siblings().remove();
                $('#node-type-panel').find('input').prop('checked', false);
            });*/
        }
    };
});
