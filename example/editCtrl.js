app.controller('editCtrl', function($scope) {

    var datascource = {
        'name': 'Ball game',
        'children': [
            { 'name': 'Football' },
            { 'name': 'Basketball' },
            { 'name': 'Volleyball' }
        ]
    };

    var getId = function() {
        return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
    };

    $('#chart-container').orgchart({
        'data' : datascource,
        'exportButton': true,
        'exportFilename': 'SportsChart',
        'parentNodeSymbol': 'fa-th-large',
        'createNode': function($node, data) {
            $node[0].id = getId();

            var secondMenuIcon = $('<i>', {
                'class': 'fa fa-info-circle second-menu-icon',
                click: function() {
                    $scope.$apply(function() {
                        $scope.node = data;
                        $scope.node.newNodeList = [{'name' : ''}];
                    });

                    $(this).siblings('.second-menu').toggle();
                }
            });
            var secondMenu = '<div class="second-menu"></div>';
            $node.append(secondMenuIcon).append(secondMenu);
        }
    })
        .on('click', '.node', function() {
            var $this = $(this);
            $('#selected-node').val($this.find('.title').text()).data('node', $this);
        })
        .on('click', '.orgchart', function(event) {
            if (!$(event.target).closest('.node').length) {
                $scope.node = {'type' : 'view', newNodeList : [{'name' : ''}]};
            }
        });

    $scope.node = {'type' : 'view', newNodeList : [{'name' : ''}]};
    $scope.editOption = function(type) {
        if(type == 'view'){
            $('#btn-reset').trigger('click');
        }
    }

    $('input[name="node-type"]').on('click', function() {
        var $this = $(this);
        if ($this.val() === 'parent') {
            $('#edit-panel').addClass('edit-parent-node');
            $('#new-nodelist').children(':gt(0)').remove();
        } else {
            $('#edit-panel').removeClass('edit-parent-node');
        }
    });

    $scope.addNewItem = function(){
        $scope.node.newNodeList.push({'name' : ''});
    }

    $scope.removeItem = function(){
        if($scope.node.newNodeList.length > 1) {
            console.log($scope.node.newNodeList);
            $scope.node.newNodeList.splice(-1,1);
        }
    }

    $('#btn-add-nodes').on('click', function() {
        var $chartContainer = $('#chart-container');
        var nodeVals = [];
        $('#new-nodelist').find('.new-node').each(function(index, item) {
            var validVal = item.value.trim();
            if (validVal.length) {
                nodeVals.push(validVal);
            }
        });
        var $node = $('#selected-node').data('node');
        console.log($node);
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
        console.log("nodeType.val()", nodeType.val());
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
    });

    $('#btn-delete-nodes').on('click', function() {
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
    });

});