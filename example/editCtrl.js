app.controller('editCtrl', function($scope) {
    $scope.nodes = ["parent","Child","Sibling"];
    $scope.nodes = ["parent","Child","Sibling"];
    var data = {
        id: 1,
        'name': 'Lao Lao',
        'title': 'general manager',
        'children': [
            { 'name': 'Bo Miao', 'title': 'department manager', id: 1.1,
                'children': [{ 'name': 'Li Xin', 'title': 'senior engineer', id:1.11 }]
            },
            { 'name': 'Su Miao', 'title': 'department manager', id: 1.21,
                'children': [
                    { 'name': 'Tie Hua', 'title': 'senior engineer', id: 2.21 },
                    { 'name': 'Hei Hei', 'title': 'senior engineer', id: 2.22,
                        'children': [
                            { 'name': 'Pang Pang', 'title': 'engineer', id: 3.11 },
                            { 'name': 'Xiang Xiang', 'title': 'UE engineer' , id: 3.21}
                        ]
                    }
                ]
            },
            { 'name': 'Hong Miao', 'title': 'department manager', id: 1.22 },
            { 'name': 'Chun Miao', 'title': 'department manager', id: 1.23 }
        ]
    };
    $scope.orgOptions = {
        'data' : data,
        'nodeContent': 'title',
        'draggable': true,
        'exportButton': true,
        'exportFilename': 'MyOrgChart',
        'pan': true,
        'zoom': true,
        'isEditable' : true,
        'dropCriteria': function ($draggedNode, $dragZone, $dropZone) {
            if ($draggedNode.find('.content').text().indexOf('manager') > -1 && $dropZone.find('.content').text().indexOf('engineer') > -1) {
                return false;
            }
            return true;
        }
    }

    // On Dropped
    $scope.dropped = function(hierarchy) {
        console.log('updated hierarchy', hierarchy);
    };
    $scope.onEdit = function(clickedNodeInfo){
        console.log("==========clickedNodeInfo",clickedNodeInfo);
    };
    $scope.nodeType = '';
    var datascource = {
        'name': 'Ball game',
        'children': [
            { 'name': 'Football' },
            { 'name': 'Basketball' },
            { 'name': 'Volleyball' ,'children': [
                { 'name': 'Tie Hua'},
                { 'name': 'Hei Hei'}
            ]}
        ]
    };

    var getId = function() {
        return (new Date().getTime()) * 1000 + Math.floor(Math.random() * 1001);
    };

    $scope.node = {'type' : 'view', newNodeList : [{'name' : ''}]};
    $scope.editOption = function(type) {
        if(type == 'view'){
            $('#btn-reset').trigger('click');
        }
    };
    $scope.selectNodeType = function (nodeType) {
        $scope.nodeType = nodeType;
        if(nodeType == 'parent'){
            $scope.parent = true;
        }
    };

    $scope.addNewItem = function(){
        $scope.node.newNodeList.push({'name' : ''});
    };

    $scope.removeItem = function(){
        if($scope.node.newNodeList.length > 1) {
            $scope.node.newNodeList.splice(-1,1);
        }
    };
    $scope.addNode  = function () {
        var $chartContainer = $('#chart-container');
        var $node = $('#selected-node').data('node');
        if (!$scope.node.newNodeList.length) {
            alert('Please input value for new node');
            return;
        }
        if (!$scope.nodeType.length) {
            alert('Please select a node type');
            return;
        }
        if ($scope.nodeType !== 'parent' && !$('.orgchart').length) {
            alert('Please creat the root node firstly when you want to build up the orgchart from the scratch');
            return;
        }
        if ($scope.nodeType !== 'parent' && !$node) {
            alert('Please select one node in orgchart');
            return;
        }
        if ($scope.nodeType === 'parent') {

            if (!$chartContainer.children().length) {// if the original chart has been deleted
                $chartContainer.orgchart({
                    'data' : { 'name': $scope.node.newNodeList[0].name.name},
                    'exportButton': true,
                    'exportFilename': 'SportsChart',
                    'parentNodeSymbol': 'fa-th-large',
                    'createNode': function($node, data) {
                        $node[0].id = getId();
                    }
                })
                    .find('.orgchart').addClass('view-state');
            } else {
                $chartContainer.orgchart('addParent', $chartContainer.find('.node:first'), { 'name': $scope.node.newNodeList[0].name, 'Id': getId() });
            }
        } else if ($scope.nodeType === 'siblings') {
            $chartContainer.orgchart('addSiblings', $node,
                { 'siblings': $scope.node.newNodeList.map(function(item) { return { 'name': item.name, 'relationship': '110', 'Id': getId() }; })
                });
        } else {
            var hasChild = $node.parent().attr('colspan') > 0 ? true : false;
            if (!hasChild) {
                var rel = $scope.node.newNodeList.length > 1 ? '110' : '100';
                $chartContainer.orgchart('addChildren', $node, {
                    'children': $scope.node.newNodeList.map(function(item) {
                        return { 'name': item.name, 'relationship': rel, 'Id': getId() };
                    })
                }, $.extend({}, $chartContainer.find('.orgchart').data('options'), { depth: 0 }));
            } else {
                $chartContainer.orgchart('addSiblings', $node.closest('tr').siblings('.nodes').find('.node:first'),
                    { 'siblings': $scope.node.newNodeList.map(function(item) { return { 'name': item.name, 'relationship': '110', 'Id': getId() }; })
                    });
            }
        }
    };
    $scope.deleteNode  = function(){
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
    };
    $scope.reset  = function () {
        $('.orgchart').find('.focused').removeClass('focused');
        $scope.node.newNodeList = [{name : ''}];
        $scope.node.name = "";
        $scope.nodeTypeName = false;
        //$('#selected-node').val('');
        //$('#new-nodelist').find('input:first').val('').parent().siblings().remove();
        $('#node-type-panel').find('input').prop('checked', false);
    };


});
