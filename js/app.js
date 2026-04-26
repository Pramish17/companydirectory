$(document).ready(function () {

    // ── Filter state ─────────────────────────────────────────────────────────
    // Persisted across loads so Refresh keeps the active filter in place.
    // Search re-queries via AJAX on keyup rather than filtering client-side,
    // keeping it consistent with the server-side department/location filters.
    var currentFilters = { departmentID: '', locationID: '' };


    // ── Helpers ───────────────────────────────────────────────────────────────

    function errorRow(colspan, msg) {
        return '<tr><td colspan="' + colspan + '" class="text-danger text-center">' + msg + '</td></tr>';
    }

    function emptyRow(colspan) {
        return '<tr><td colspan="' + colspan + '" class="text-muted text-center">No records found.</td></tr>';
    }


    // ── Data loaders ─────────────────────────────────────────────────────────

    function loadPersonnel() {

        $.ajax({
            url: 'libs/php/getAllPersonnel.php',
            type: 'POST',
            dataType: 'json',
            data: {
                departmentID: currentFilters.departmentID,
                locationID:   currentFilters.locationID,
                search:       $('#searchInp').val()
            },
            success: function (result) {

                if (result.status.code == 200) {

                    if (result.data.length === 0) {
                        $('#personnelTableBody').html(emptyRow(7));
                        return;
                    }

                    var html = '';
                    $.each(result.data, function (i, p) {
                        html +=
                            '<tr>' +
                            '<td>' + (p.lastName  || '') + '</td>' +
                            '<td>' + (p.firstName || '') + '</td>' +
                            '<td class="d-none d-md-table-cell">' + (p.jobTitle   || '') + '</td>' +
                            '<td class="d-none d-md-table-cell">' + (p.email      || '') + '</td>' +
                            '<td class="d-none d-md-table-cell">' + (p.department || '') + '</td>' +
                            '<td class="d-none d-md-table-cell">' + (p.location   || '') + '</td>' +
                            '<td>' +
                                '<button class="btn btn-outline-primary btn-sm me-1" ' +
                                    'data-bs-toggle="modal" data-bs-target="#editPersonnelModal" ' +
                                    'data-id="' + p.id + '" title="Edit">' +
                                    '<i class="fas fa-pencil-alt"></i>' +
                                '</button>' +
                                '<button class="btn btn-outline-danger btn-sm" ' +
                                    'data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" ' +
                                    'data-id="' + p.id + '" title="Delete">' +
                                    '<i class="fas fa-trash-alt"></i>' +
                                '</button>' +
                            '</td>' +
                            '</tr>';
                    });
                    $('#personnelTableBody').html(html);

                } else {
                    $('#personnelTableBody').html(errorRow(7, result.status.description));
                }
            },
            error: function () {
                $('#personnelTableBody').html(errorRow(7, 'AJAX request failed — check the console.'));
            }
        });
    }

    function loadDepartments() {

        $.ajax({
            url: 'libs/php/getAllDepartments.php',
            type: 'POST',
            dataType: 'json',
            success: function (result) {

                if (result.status.code == 200) {

                    if (result.data.length === 0) {
                        $('#departmentTableBody').html(emptyRow(3));
                        return;
                    }

                    var html = '';
                    $.each(result.data, function (i, d) {
                        html +=
                            '<tr>' +
                            '<td>' + (d.name     || '') + '</td>' +
                            '<td class="d-none d-md-table-cell">' + (d.location || '') + '</td>' +
                            '<td>' +
                                '<button class="btn btn-outline-primary btn-sm me-1" ' +
                                    'data-bs-toggle="modal" data-bs-target="#editDepartmentModal" ' +
                                    'data-id="' + d.id + '" title="Edit">' +
                                    '<i class="fas fa-pencil-alt"></i>' +
                                '</button>' +
                                '<button class="btn btn-outline-danger btn-sm" ' +
                                    'data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" ' +
                                    'data-id="' + d.id + '" title="Delete">' +
                                    '<i class="fas fa-trash-alt"></i>' +
                                '</button>' +
                            '</td>' +
                            '</tr>';
                    });
                    $('#departmentTableBody').html(html);

                } else {
                    $('#departmentTableBody').html(errorRow(3, result.status.description));
                }
            },
            error: function () {
                $('#departmentTableBody').html(errorRow(3, 'AJAX request failed — check the console.'));
            }
        });
    }

    function loadLocations() {

        $.ajax({
            url: 'libs/php/getAllLocations.php',
            type: 'POST',
            dataType: 'json',
            success: function (result) {

                if (result.status.code == 200) {

                    if (result.data.length === 0) {
                        $('#locationTableBody').html(emptyRow(2));
                        return;
                    }

                    var html = '';
                    $.each(result.data, function (i, l) {
                        html +=
                            '<tr>' +
                            '<td>' + (l.name || '') + '</td>' +
                            '<td>' +
                                '<button class="btn btn-outline-primary btn-sm me-1" ' +
                                    'data-bs-toggle="modal" data-bs-target="#editLocationModal" ' +
                                    'data-id="' + l.id + '" title="Edit">' +
                                    '<i class="fas fa-pencil-alt"></i>' +
                                '</button>' +
                                '<button class="btn btn-outline-danger btn-sm" ' +
                                    'data-bs-toggle="modal" data-bs-target="#deleteLocationModal" ' +
                                    'data-id="' + l.id + '" title="Delete">' +
                                    '<i class="fas fa-trash-alt"></i>' +
                                '</button>' +
                            '</td>' +
                            '</tr>';
                    });
                    $('#locationTableBody').html(html);

                } else {
                    $('#locationTableBody').html(errorRow(2, result.status.description));
                }
            },
            error: function () {
                $('#locationTableBody').html(errorRow(2, 'AJAX request failed — check the console.'));
            }
        });
    }


    // ── Initial load ──────────────────────────────────────────────────────────

    loadPersonnel();


    // ── Tab buttons ───────────────────────────────────────────────────────────
    // Bootstrap handles active class and pane visibility via data-bs-toggle="tab".
    // These click handlers just trigger the data load.

    $('#personnelBtn').on('click', function () {
        loadPersonnel();
    });

    $('#departmentsBtn').on('click', function () {
        loadDepartments();
    });

    $('#locationsBtn').on('click', function () {
        loadLocations();
    });


    // ── Toolbar buttons ───────────────────────────────────────────────────────

    $('#refreshBtn').on('click', function () {
        if ($('#personnelBtn').hasClass('active')) {
            loadPersonnel();
        } else if ($('#departmentsBtn').hasClass('active')) {
            loadDepartments();
        } else if ($('#locationsBtn').hasClass('active')) {
            loadLocations();
        }
    });

    $('#addBtn').on('click', function () {
        if ($('#personnelBtn').hasClass('active')) {
            $('#addPersonnelModal').modal('show');
        } else if ($('#departmentsBtn').hasClass('active')) {
            $('#addDepartmentModal').modal('show');
        } else if ($('#locationsBtn').hasClass('active')) {
            $('#addLocationModal').modal('show');
        }
    });

    $('#filterBtn').on('click', function () {
        $('#filterPersonnelModal').modal('show');
    });

    // Search re-queries the server; only active when on the Personnel tab.
    $('#searchInp').on('keyup', function () {
        if ($('#personnelBtn').hasClass('active')) {
            loadPersonnel();
        }
    });


    // ── PERSONNEL MODALS ──────────────────────────────────────────────────────

    // --- Add Personnel ---

    $('#addPersonnelModal').on('show.bs.modal', function () {

        $('#addPersonnelFirstName, #addPersonnelLastName, #addPersonnelJobTitle, #addPersonnelEmail').val('');

        $.ajax({
            url: 'libs/php/getAllDepartments.php',
            type: 'POST',
            dataType: 'json',
            success: function (result) {
                if (result.status.code == 200) {
                    var opts = '<option value="">-- Select Department --</option>';
                    $.each(result.data, function (i, d) {
                        opts += '<option value="' + d.id + '">' + d.name + '</option>';
                    });
                    $('#addPersonnelDepartment').html(opts);
                }
            }
        });
    });

    $('#addPersonnelSaveBtn').on('click', function () {

        $.ajax({
            url: 'libs/php/insertPersonnel.php',
            type: 'POST',
            dataType: 'json',
            data: {
                firstName:    $('#addPersonnelFirstName').val(),
                lastName:     $('#addPersonnelLastName').val(),
                jobTitle:     $('#addPersonnelJobTitle').val(),
                email:        $('#addPersonnelEmail').val(),
                departmentID: $('#addPersonnelDepartment').val()
            },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#addPersonnelModal').modal('hide');
                    loadPersonnel();
                } else {
                    alert('Error: ' + result.status.description);
                }
            }
        });
    });

    // --- Edit Personnel ---

    $('#editPersonnelModal').on('show.bs.modal', function (e) {

        var id = $(e.relatedTarget).attr('data-id');
        $('#editPersonnelModalTitle').text('Edit Personnel');

        $.ajax({
            url: 'libs/php/getPersonnelByID.php',
            type: 'POST',
            dataType: 'json',
            data: { id: id },
            success: function (result) {

                if (result.status.code == 200) {

                    var p = result.data.personnel[0];
                    $('#editPersonnelID').val(p.id);
                    $('#editPersonnelFirstName').val(p.firstName);
                    $('#editPersonnelLastName').val(p.lastName);
                    $('#editPersonnelJobTitle').val(p.jobTitle);
                    $('#editPersonnelEmail').val(p.email);

                    var opts = '<option value="">-- Select Department --</option>';
                    $.each(result.data.department, function (i, d) {
                        var sel = (d.id == p.departmentID) ? ' selected' : '';
                        opts += '<option value="' + d.id + '"' + sel + '>' + d.name + '</option>';
                    });
                    $('#editPersonnelDepartment').html(opts);

                } else {
                    $('#editPersonnelModalTitle').text('Error: ' + result.status.description);
                }
            }
        });
    });

    $('#editPersonnelSaveBtn').on('click', function () {

        $.ajax({
            url: 'libs/php/updatePersonnel.php',
            type: 'POST',
            dataType: 'json',
            data: {
                id:           $('#editPersonnelID').val(),
                firstName:    $('#editPersonnelFirstName').val(),
                lastName:     $('#editPersonnelLastName').val(),
                jobTitle:     $('#editPersonnelJobTitle').val(),
                email:        $('#editPersonnelEmail').val(),
                departmentID: $('#editPersonnelDepartment').val()
            },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#editPersonnelModal').modal('hide');
                    loadPersonnel();
                } else {
                    alert('Error: ' + result.status.description);
                }
            }
        });
    });

    // --- Delete Personnel ---

    $('#deletePersonnelModal').on('show.bs.modal', function (e) {

        var id = $(e.relatedTarget).attr('data-id');
        $('#deletePersonnelID').val(id);
        $('#deletePersonnelName').text('');

        // Fetch name so the user knows what they are deleting
        $.ajax({
            url: 'libs/php/getPersonnelByID.php',
            type: 'POST',
            dataType: 'json',
            data: { id: id },
            success: function (result) {
                if (result.status.code == 200) {
                    var p = result.data.personnel[0];
                    $('#deletePersonnelName').text(p.firstName + ' ' + p.lastName);
                }
            }
        });
    });

    $('#deletePersonnelConfirmBtn').on('click', function () {

        $.ajax({
            url: 'libs/php/deletePersonnelByID.php',
            type: 'POST',
            dataType: 'json',
            data: { id: $('#deletePersonnelID').val() },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#deletePersonnelModal').modal('hide');
                    loadPersonnel();
                } else {
                    alert('Error: ' + result.status.description);
                }
            }
        });
    });


    // ── DEPARTMENT MODALS ─────────────────────────────────────────────────────

    // --- Add Department ---

    $('#addDepartmentModal').on('show.bs.modal', function () {

        $('#addDepartmentName').val('');

        $.ajax({
            url: 'libs/php/getAllLocations.php',
            type: 'POST',
            dataType: 'json',
            success: function (result) {
                if (result.status.code == 200) {
                    var opts = '<option value="">-- Select Location --</option>';
                    $.each(result.data, function (i, l) {
                        opts += '<option value="' + l.id + '">' + l.name + '</option>';
                    });
                    $('#addDepartmentLocation').html(opts);
                }
            }
        });
    });

    $('#addDepartmentSaveBtn').on('click', function () {

        $.ajax({
            url: 'libs/php/insertDepartment.php',
            type: 'POST',
            dataType: 'json',
            data: {
                name:       $('#addDepartmentName').val(),
                locationID: $('#addDepartmentLocation').val()
            },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#addDepartmentModal').modal('hide');
                    loadDepartments();
                } else {
                    alert('Error: ' + result.status.description);
                }
            }
        });
    });

    // --- Edit Department ---

    $('#editDepartmentModal').on('show.bs.modal', function (e) {

        var id = $(e.relatedTarget).attr('data-id');
        $('#editDepartmentModalTitle').text('Edit Department');

        $.ajax({
            url: 'libs/php/getDepartmentByID.php',
            type: 'POST',
            dataType: 'json',
            data: { id: id },
            success: function (result) {

                if (result.status.code == 200) {

                    var d = result.data.department[0];
                    $('#editDepartmentID').val(d.id);
                    $('#editDepartmentName').val(d.name);

                    var opts = '<option value="">-- Select Location --</option>';
                    $.each(result.data.location, function (i, l) {
                        var sel = (l.id == d.locationID) ? ' selected' : '';
                        opts += '<option value="' + l.id + '"' + sel + '>' + l.name + '</option>';
                    });
                    $('#editDepartmentLocation').html(opts);

                } else {
                    $('#editDepartmentModalTitle').text('Error: ' + result.status.description);
                }
            }
        });
    });

    $('#editDepartmentSaveBtn').on('click', function () {

        $.ajax({
            url: 'libs/php/updateDepartment.php',
            type: 'POST',
            dataType: 'json',
            data: {
                id:         $('#editDepartmentID').val(),
                name:       $('#editDepartmentName').val(),
                locationID: $('#editDepartmentLocation').val()
            },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#editDepartmentModal').modal('hide');
                    loadDepartments();
                } else {
                    alert('Error: ' + result.status.description);
                }
            }
        });
    });

    // --- Delete Department ---

    $('#deleteDepartmentModal').on('show.bs.modal', function (e) {

        var id = $(e.relatedTarget).attr('data-id');
        $('#deleteDepartmentID').val(id);
        $('#deleteDepartmentName').text('');
        $('#deleteDepartmentMsg').text('Checking…');
        $('#deleteDepartmentConfirmBtn').prop('disabled', true);

        $.ajax({
            url: 'libs/php/checkDepartmentUse.php',
            type: 'POST',
            dataType: 'json',
            data: { id: id },
            success: function (result) {

                if (result.status.code == 200) {

                    var row   = result.data[0];
                    var count = parseInt(row.personnelCount, 10);
                    $('#deleteDepartmentName').text(row.departmentName);

                    if (count > 0) {
                        $('#deleteDepartmentMsg').text(
                            'Cannot delete — ' + count + ' personnel still assigned to this department.'
                        );
                        $('#deleteDepartmentConfirmBtn').prop('disabled', true);
                    } else {
                        $('#deleteDepartmentMsg').text('Are you sure you want to delete:');
                        $('#deleteDepartmentConfirmBtn').prop('disabled', false);
                    }
                }
            }
        });
    });

    $('#deleteDepartmentConfirmBtn').on('click', function () {

        $.ajax({
            url: 'libs/php/deleteDepartmentByID.php',
            type: 'POST',
            dataType: 'json',
            data: { id: $('#deleteDepartmentID').val() },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#deleteDepartmentModal').modal('hide');
                    loadDepartments();
                } else {
                    alert('Error: ' + result.status.description);
                }
            }
        });
    });


    // ── LOCATION MODALS ───────────────────────────────────────────────────────

    // --- Add Location ---

    $('#addLocationModal').on('show.bs.modal', function () {
        $('#addLocationName').val('');
    });

    $('#addLocationSaveBtn').on('click', function () {

        $.ajax({
            url: 'libs/php/insertLocation.php',
            type: 'POST',
            dataType: 'json',
            data: { name: $('#addLocationName').val() },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#addLocationModal').modal('hide');
                    loadLocations();
                } else {
                    alert('Error: ' + result.status.description);
                }
            }
        });
    });

    // --- Edit Location ---

    $('#editLocationModal').on('show.bs.modal', function (e) {

        var id = $(e.relatedTarget).attr('data-id');
        $('#editLocationModalTitle').text('Edit Location');

        $.ajax({
            url: 'libs/php/getLocationByID.php',
            type: 'POST',
            dataType: 'json',
            data: { id: id },
            success: function (result) {

                if (result.status.code == 200) {
                    var l = result.data[0];
                    $('#editLocationID').val(l.id);
                    $('#editLocationName').val(l.name);
                } else {
                    $('#editLocationModalTitle').text('Error: ' + result.status.description);
                }
            }
        });
    });

    $('#editLocationSaveBtn').on('click', function () {

        $.ajax({
            url: 'libs/php/updateLocation.php',
            type: 'POST',
            dataType: 'json',
            data: {
                id:   $('#editLocationID').val(),
                name: $('#editLocationName').val()
            },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#editLocationModal').modal('hide');
                    loadLocations();
                } else {
                    alert('Error: ' + result.status.description);
                }
            }
        });
    });

    // --- Delete Location ---

    $('#deleteLocationModal').on('show.bs.modal', function (e) {

        var id = $(e.relatedTarget).attr('data-id');
        $('#deleteLocationID').val(id);
        $('#deleteLocationName').text('');
        $('#deleteLocationMsg').text('Checking…');
        $('#deleteLocationConfirmBtn').prop('disabled', true);

        $.ajax({
            url: 'libs/php/checkLocationUse.php',
            type: 'POST',
            dataType: 'json',
            data: { id: id },
            success: function (result) {

                if (result.status.code == 200) {

                    var row   = result.data[0];
                    var count = parseInt(row.departmentCount, 10);
                    $('#deleteLocationName').text(row.locationName);

                    if (count > 0) {
                        $('#deleteLocationMsg').text(
                            'Cannot delete — ' + count + ' department(s) still assigned to this location.'
                        );
                        $('#deleteLocationConfirmBtn').prop('disabled', true);
                    } else {
                        $('#deleteLocationMsg').text('Are you sure you want to delete:');
                        $('#deleteLocationConfirmBtn').prop('disabled', false);
                    }
                }
            }
        });
    });

    $('#deleteLocationConfirmBtn').on('click', function () {

        $.ajax({
            url: 'libs/php/deleteLocationByID.php',
            type: 'POST',
            dataType: 'json',
            data: { id: $('#deleteLocationID').val() },
            success: function (result) {
                if (result.status.code == 200) {
                    $('#deleteLocationModal').modal('hide');
                    loadLocations();
                } else {
                    alert('Error: ' + result.status.description);
                }
            }
        });
    });


    // ── FILTER MODAL ──────────────────────────────────────────────────────────

    $('#filterPersonnelModal').on('show.bs.modal', function () {

        // Load both dropdowns in parallel; pre-select current filter values
        $.ajax({
            url: 'libs/php/getAllDepartments.php',
            type: 'POST',
            dataType: 'json',
            success: function (result) {
                if (result.status.code == 200) {
                    var opts = '<option value="">-- All Departments --</option>';
                    $.each(result.data, function (i, d) {
                        var sel = (d.id == currentFilters.departmentID) ? ' selected' : '';
                        opts += '<option value="' + d.id + '"' + sel + '>' + d.name + '</option>';
                    });
                    $('#filterDepartment').html(opts);
                }
            }
        });

        $.ajax({
            url: 'libs/php/getAllLocations.php',
            type: 'POST',
            dataType: 'json',
            success: function (result) {
                if (result.status.code == 200) {
                    var opts = '<option value="">-- All Locations --</option>';
                    $.each(result.data, function (i, l) {
                        var sel = (l.id == currentFilters.locationID) ? ' selected' : '';
                        opts += '<option value="' + l.id + '"' + sel + '>' + l.name + '</option>';
                    });
                    $('#filterLocation').html(opts);
                }
            }
        });
    });

    $('#filterApplyBtn').on('click', function () {
        currentFilters.departmentID = $('#filterDepartment').val();
        currentFilters.locationID   = $('#filterLocation').val();
        $('#filterPersonnelModal').modal('hide');
        loadPersonnel();
    });

    $('#filterClearBtn').on('click', function () {
        currentFilters = { departmentID: '', locationID: '' };
        $('#filterPersonnelModal').modal('hide');
        loadPersonnel();
    });

});
