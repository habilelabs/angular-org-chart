app.controller('editCtrl', function($scope) {
    $scope.nodes = ["Parent(root)","Child","Sibling"];
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

    $('#chart-container').orgchart({
        'data' : datascource,
        'exportButton': true,
        'exportFilename': 'SportsChart',
        'parentNodeSymbol': 'fa-th-large',
        'createNode': function($node, data) {
            $node.on('click', function (event) {
                if (!$(event.target).is('.edge')) {
                    $scope.node= {name:data.name};
                    $scope.node.newNodeList = [{'name' : ''}];
                }
            });
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
    };
    $scope.selectNodeType = function (nodeType) {
        $scope.nodeType = nodeType;
        if(nodeType == 'Parent(root)'){
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
        if ($scope.nodeType !== 'Parent(root)' && !$('.orgchart').length) {
            alert('Please creat the root node firstly when you want to build up the orgchart from the scratch');
            return;
        }
        if ($scope.nodeType !== 'Parent(root)' && !$node) {
            alert('Please select one node in orgchart');
            return;
        }
        if ($scope.nodeType === 'Parent(root)') {
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
