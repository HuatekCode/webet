"use strict"

/**
 * Created by andre_zhang on 2015/9/27.
 * deal with event business logic
 */
angular
    .module('setting')
    .controller('settingAppCtrl', settingAppCtrl)

settingAppCtrl.$inject = ['$scope', 'IntegralUITreeGridService', '$timeout', 'httpUtils', 'settingService'];

function settingAppCtrl($scope, $gridService, $timeout, httpUtils, settingService) {
    $scope.buttonTitle = 'Submit';//set button text

    $scope.gridName = 'gridSample';//set treegrid name
    $scope.gridLines = 'vertical';
    $scope.columns = [];
    var column = {
        "columns": [
            {
                id: 1,
                headerText: 'Available',
                contentAlignment: 'center',
                editorType: 'checkbox',
                editorSettings: {
                    style: {
                        general: 'checkbox',
                        box: {
                            general: 'checkbox-box',
                            checked: 'checkbox-checked',
                            unchecked: 'checkbox-unchecked'
                        }
                    },
                    threeState: false
                },
                width: 80,
                fixedWidth: true
            },
            {id: 2, headerText: 'Title', headerAlignment: 'center', width: 300},
            {id: 3, headerText: 'Open Date', headerAlignment: 'center', contentAlignment: 'left', width: 200},
            {id: 4, headerText: 'Start Time', headerAlignment: 'center', contentAlignment: 'left', width: 200},
            {id: 5, headerText: 'Status', headerAlignment: 'center', contentAlignment: 'center', width: 100}
        ]
    };

    $scope.rows = [];
    $scope.loading = true;

    /**
     * load treeGrid
     */
    $scope.loadRemote = function () {
        settingService.loadData(function (data) {
            // Suspend the Layout
            $gridService.suspendLayout($scope.gridName);
            $gridService.clearColumns($scope.gridName);
            $gridService.clearRows($scope.gridName);
            // Add Columns
            for (var j = 0; j < column.columns.length; j++) {
                $scope.columns.push(column.columns[j]);
            }
            // Add Rows
            $gridService.loadData($scope.gridName, data, null, null, true);

            $gridService.expandColIndex($scope.gridName, 1);
            // Update the Layout
            $gridService.resumeLayout($scope.gridName);
            $scope.loading = false;
        }, function (data) {
            alert("AJAX failed to Load Data");
            $scope.loading = false;
        });
    };

    $scope.loadRemote();

    /**
     * cell click
     * @param e
     */
    $scope.onCellClick = function (e) {
        if (e.row) {
            if (e.cell && e.cell.cid === 1) {
                var checkValue = (e.cell.value === true || e.cell.value === 'checked') ? false : true;
                $(".submit").prop("disabled", false);
                $(".submit").removeClass("disabled");

                updateCheckValues(e.row, checkValue);
            }
        }
    };

    /**
     * Update the checkbox of rows
     * @param row
     * @param value
     */
    var updateCheckValues = function (row, value) {
        // Child rows
        updateChildRowCheckValue(row, value);

        // Parent rows
        var parent = $gridService.getRowParent($scope.gridName, row);
        if (parent)
            updateParentRowCheckValue(parent);
    };

    /**
     * Update the checkbox of child rows
     * @param row
     * @param parentValue
     */
    var updateChildRowCheckValue = function (row, parentValue) {
        var cell = getCheckCell(row);
        if (cell) {
            // Current Row
            cell.value = parentValue;
            // Child rows
            var list = row.rows;
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    updateChildRowCheckValue(list[i], cell.value);
                }
            }
        }
    };

    /**
     * Update the checkbox of parent rows
     * @param parent
     */
    var updateParentRowCheckValue = function (parent) {
        while (parent) {
            var parentCell = getCheckCell(parent);
            if (parentCell) {
                var list = parent.rows;
                if (list) {
                    var checkCount = 0;
                    for (var i = 0; i < list.length; i++) {
                        var cell = getCheckCell(list[i]);
                        if (cell) {
                            if (cell.value == true)
                                checkCount++;
                        }
                    }

                    if (checkCount > 0) {
                        parentCell.value = true;
                    }
                    else {
                        parentCell.value = false;
                    }
                }
            }
            parent = $gridService.getRowParent($scope.gridName, parent);
        }
    };

    /**
     * Get the checkbox of cell
     * @param row
     */
    var getCheckCell = function (row) {
        var cell = null;
        if (row && row.cells) {
            for (var j = 0; j < row.cells.length; j++) {
                if (row.cells[j].cid == 1) {
                    cell = row.cells[j];
                    break;
                }
            }
        }
        return cell;
    };

    /**
     * submit click event
     */
    $scope.SaveClick = function () {
        if (confirm('Do you confirm to submit?')) {
            updateData();
        }
    };

    /**
     * Update Data
     * @param checkValue
     */
    var updateData = function () {
        $scope.loading = true;
        var list = $gridService.getFlatList($scope.gridName, true);
        var row;
        var childrens = '';
        for (var i = 0; i < list.length; i++) {
            row = list[i];
            var checkValue = row.cells[0].value;
            var style = {normal: ''};
            if (checkValue) {
                if (row.rows == undefined)
                    childrens += row.text + ',';
            }
            else{
                style = {normal: 'grey'};
            }

            //change cell style
            var cell = null;
            for(var j=0;j<row.cells.length;j++) {
                cell = row.cells[j];
                cell.style = style;
            }
        }
        settingService.updateData(childrens, function (response) {
            alert(response.data);
            //$scope.loadRemote();
            $scope.loading = false;

            //refresh treegrid
            var refreshTimer = $timeout(function(){
                $gridService.updateView($scope.gridName);
                $timeout.cancel(refreshTimer);
            }, 1);
        }, function (data) {
            alert(response.data);
            $scope.loadRemote();
        });
    };
}