app.controller('mainCtrl', function($scope) {
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
    }
});