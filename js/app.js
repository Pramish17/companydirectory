// All endpoints are served from this app's own PHP backend (relative path),
// so the same code works on XAMPP locally and on the live host.
var path = "libs/php/";

// Holds the currently applied personnel filter so that refresh / search
// keep it in place. Multi-user solution: data is always re-fetched, never cached.
var personnelFilter = { departmentID: "", locationID: "" };

// =================================================================
// TABLE LOADERS
// =================================================================

function loadPersonnel() {

  $.ajax({
    url: path + "getAllPersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      departmentID: personnelFilter.departmentID,
      locationID: personnelFilter.locationID,
      search: $("#searchInp").val()
    },
    success: function (result) {

      if (result.status.code == 200) {

        $("#personnelTableBody").html("");

        $.each(result.data, function () {

          $("#personnelTableBody").append(
            "<tr>" +
              "<td class='align-middle text-nowrap'>" +
                this.lastName + ", " + this.firstName +
              "</td>" +
              "<td class='align-middle text-nowrap d-none d-md-table-cell'>" +
                (this.department == null ? "" : this.department) +
              "</td>" +
              "<td class='align-middle text-nowrap d-none d-md-table-cell'>" +
                (this.location == null ? "" : this.location) +
              "</td>" +
              "<td class='align-middle text-nowrap d-none d-md-table-cell'>" +
                this.email +
              "</td>" +
              "<td class='text-end text-nowrap'>" +
                "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#editPersonnelModal' data-id='" + this.id + "'>" +
                  "<i class='fa-solid fa-pencil fa-fw'></i>" +
                "</button> " +
                "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#deletePersonnelModal' data-id='" + this.id + "'>" +
                  "<i class='fa-solid fa-trash fa-fw'></i>" +
                "</button>" +
              "</td>" +
            "</tr>"
          );

        });

      } else {
        $("#personnelTableBody").html("<tr><td>Error retrieving data</td></tr>");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#personnelTableBody").html("<tr><td>Error retrieving data</td></tr>");
    }
  });
}

function loadDepartments() {

  $.ajax({
    url: path + "getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {

      if (result.status.code == 200) {

        $("#departmentTableBody").html("");

        $.each(result.data, function () {

          $("#departmentTableBody").append(
            "<tr>" +
              "<td class='align-middle text-nowrap'>" +
                this.name +
              "</td>" +
              "<td class='align-middle text-nowrap d-none d-md-table-cell'>" +
                (this.location == null ? "" : this.location) +
              "</td>" +
              "<td class='align-middle text-end text-nowrap'>" +
                "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#editDepartmentModal' data-id='" + this.id + "'>" +
                  "<i class='fa-solid fa-pencil fa-fw'></i>" +
                "</button> " +
                "<button type='button' class='btn btn-primary btn-sm deleteDepartmentBtn' data-id='" + this.id + "'>" +
                  "<i class='fa-solid fa-trash fa-fw'></i>" +
                "</button>" +
              "</td>" +
            "</tr>"
          );

        });

      } else {
        $("#departmentTableBody").html("<tr><td>Error retrieving data</td></tr>");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#departmentTableBody").html("<tr><td>Error retrieving data</td></tr>");
    }
  });
}

function loadLocations() {

  $.ajax({
    url: path + "getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {

      if (result.status.code == 200) {

        $("#locationTableBody").html("");

        $.each(result.data, function () {

          $("#locationTableBody").append(
            "<tr>" +
              "<td class='align-middle text-nowrap'>" +
                this.name +
              "</td>" +
              "<td class='align-middle text-end text-nowrap'>" +
                "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal' data-bs-target='#editLocationModal' data-id='" + this.id + "'>" +
                  "<i class='fa-solid fa-pencil fa-fw'></i>" +
                "</button> " +
                "<button type='button' class='btn btn-primary btn-sm deleteLocationBtn' data-id='" + this.id + "'>" +
                  "<i class='fa-solid fa-trash fa-fw'></i>" +
                "</button>" +
              "</td>" +
            "</tr>"
          );

        });

      } else {
        $("#locationTableBody").html("<tr><td>Error retrieving data</td></tr>");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#locationTableBody").html("<tr><td>Error retrieving data</td></tr>");
    }
  });
}

// Populate the personnel table on first load
loadPersonnel();

// =================================================================
// HEADER BUTTONS
// =================================================================

$("#searchInp").on("keyup", function () {

  // Re-query the server so the search respects any active department/location
  // filter and stays consistent with the multi-user "always re-fetch" rule.
  // Only meaningful on the personnel tab.
  if ($("#personnelBtn").hasClass("active")) {
    loadPersonnel();
  }

});

$("#refreshBtn").click(function () {

  if ($("#personnelBtn").hasClass("active")) {

    loadPersonnel();

  } else {

    if ($("#departmentsBtn").hasClass("active")) {

      loadDepartments();

    } else {

      loadLocations();

    }

  }

});

$("#filterBtn").click(function () {

  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  $("#filterPersonnelModal").modal("show");

});

$("#addBtn").click(function () {

  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display

  if ($("#personnelBtn").hasClass("active")) {

    $("#addPersonnelModal").modal("show");

  } else {

    if ($("#departmentsBtn").hasClass("active")) {

      $("#addDepartmentModal").modal("show");

    } else {

      $("#addLocationModal").modal("show");

    }

  }

});

$("#personnelBtn").click(function () {

  // Call function to refresh personnel table
  loadPersonnel();

});

$("#departmentsBtn").click(function () {

  // Call function to refresh department table
  loadDepartments();

});

$("#locationsBtn").click(function () {

  // Call function to refresh location table
  loadLocations();

});

// =================================================================
// PERSONNEL MODALS
// =================================================================

$("#editPersonnelModal").on("show.bs.modal", function (e) {

  $.ajax({
    url: path + "getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      // Retrieve the data-id attribute from the calling button
      // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
      // for the non-jQuery JavaScript alternative
      id: $(e.relatedTarget).attr("data-id")
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {

        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted

        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);

      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    }
  });
});

// Executes when the form button with type="submit" is clicked

$("#editPersonnelForm").on("submit", function (e) {

  // Executes when the form button with type="submit" is clicked
  // stop the default browser behviour

  e.preventDefault();

  // AJAX call to save form data

  $.ajax({
    url: path + "updatePersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#editPersonnelEmployeeID").val(),
      firstName: $("#editPersonnelFirstName").val(),
      lastName: $("#editPersonnelLastName").val(),
      jobTitle: $("#editPersonnelJobTitle").val(),
      email: $("#editPersonnelEmailAddress").val(),
      departmentID: $("#editPersonnelDepartment").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editPersonnelModal").modal("hide");
        loadPersonnel();
      } else {
        $("#editPersonnelModal .modal-title").html("Error saving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").html("Error saving data");
    }
  });
});

$("#addPersonnelModal").on("show.bs.modal", function (e) {

  $("#addPersonnelForm")[0].reset();

  $.ajax({
    url: path + "getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {

        $("#addPersonnelDepartment").html("");

        $.each(result.data, function () {
          $("#addPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

      } else {
        $("#addPersonnelModal .modal-title").html("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addPersonnelModal .modal-title").html("Error retrieving data");
    }
  });
});

$("#addPersonnelForm").on("submit", function (e) {

  e.preventDefault();

  $.ajax({
    url: path + "insertPersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: $("#addPersonnelFirstName").val(),
      lastName: $("#addPersonnelLastName").val(),
      jobTitle: $("#addPersonnelJobTitle").val(),
      email: $("#addPersonnelEmailAddress").val(),
      departmentID: $("#addPersonnelDepartment").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#addPersonnelModal").modal("hide");
        loadPersonnel();
      } else {
        $("#addPersonnelModal .modal-title").html("Error saving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addPersonnelModal .modal-title").html("Error saving data");
    }
  });
});

$("#deletePersonnelModal").on("show.bs.modal", function (e) {

  var id = $(e.relatedTarget).attr("data-id");
  $("#deletePersonnelEmployeeID").val(id);

  // Personnel is a leaf table, so no integrity check is required
  $("#deletePersonnelMsg").html("Are you sure you want to delete this employee?");

});

$("#deletePersonnelForm").on("submit", function (e) {

  e.preventDefault();

  $.ajax({
    url: path + "deletePersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#deletePersonnelEmployeeID").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#deletePersonnelModal").modal("hide");
        loadPersonnel();
      } else {
        $("#deletePersonnelModal .modal-title").html("Error deleting data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deletePersonnelModal .modal-title").html("Error deleting data");
    }
  });
});

// =================================================================
// DEPARTMENT MODALS
// =================================================================

$("#editDepartmentModal").on("show.bs.modal", function (e) {

  $.ajax({
    url: path + "getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id")
    },
    success: function (result) {
      if (result.status.code == 200) {

        $("#editDepartmentID").val(result.data.department[0].id);
        $("#editDepartmentName").val(result.data.department[0].name);

        $("#editDepartmentLocation").html("");

        $.each(result.data.location, function () {
          $("#editDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $("#editDepartmentLocation").val(result.data.department[0].locationID);

      } else {
        $("#editDepartmentModal .modal-title").html("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal .modal-title").html("Error retrieving data");
    }
  });
});

$("#editDepartmentForm").on("submit", function (e) {

  e.preventDefault();

  $.ajax({
    url: path + "updateDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#editDepartmentID").val(),
      name: $("#editDepartmentName").val(),
      locationID: $("#editDepartmentLocation").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editDepartmentModal").modal("hide");
        loadDepartments();
      } else {
        $("#editDepartmentModal .modal-title").html("Error saving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal .modal-title").html("Error saving data");
    }
  });
});

$("#addDepartmentModal").on("show.bs.modal", function (e) {

  $("#addDepartmentForm")[0].reset();

  $.ajax({
    url: path + "getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {

        $("#addDepartmentLocation").html("");

        $.each(result.data, function () {
          $("#addDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

      } else {
        $("#addDepartmentModal .modal-title").html("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addDepartmentModal .modal-title").html("Error retrieving data");
    }
  });
});

$("#addDepartmentForm").on("submit", function (e) {

  e.preventDefault();

  $.ajax({
    url: path + "insertDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      name: $("#addDepartmentName").val(),
      locationID: $("#addDepartmentLocation").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#addDepartmentModal").modal("hide");
        loadDepartments();
      } else {
        $("#addDepartmentModal .modal-title").html("Error saving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addDepartmentModal .modal-title").html("Error saving data");
    }
  });
});

// Department delete button is opened via JS (not data-bs-target) so the
// referential-integrity check can run first.
$("#departmentTableBody").on("click", ".deleteDepartmentBtn", function () {

  var id = $(this).attr("data-id");
  $("#deleteDepartmentID").val(id);

  $.ajax({
    url: path + "checkDepartmentUse.php",
    type: "POST",
    dataType: "json",
    data: {
      id: id
    },
    success: function (result) {
      if (result.status.code == 200) {

        var count = parseInt(result.data[0].personnelCount, 10);

        if (count > 0) {
          $("#deleteDepartmentMsg").html(
            "Cannot delete &mdash; " + count + " personnel still assigned to this department."
          );
          $("#deleteDepartmentConfirmBtn").prop("disabled", true);
        } else {
          $("#deleteDepartmentMsg").html("Are you sure you want to delete this department?");
          $("#deleteDepartmentConfirmBtn").prop("disabled", false);
        }

        $("#deleteDepartmentModal").modal("show");

      } else {
        $("#deleteDepartmentMsg").html("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteDepartmentMsg").html("Error retrieving data");
    }
  });
});

$("#deleteDepartmentForm").on("submit", function (e) {

  e.preventDefault();

  $.ajax({
    url: path + "deleteDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#deleteDepartmentID").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#deleteDepartmentModal").modal("hide");
        loadDepartments();
      } else {
        $("#deleteDepartmentModal .modal-title").html("Error deleting data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteDepartmentModal .modal-title").html("Error deleting data");
    }
  });
});

// =================================================================
// LOCATION MODALS
// =================================================================

$("#editLocationModal").on("show.bs.modal", function (e) {

  $.ajax({
    url: path + "getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id")
    },
    success: function (result) {
      if (result.status.code == 200) {

        $("#editLocationID").val(result.data[0].id);
        $("#editLocationName").val(result.data[0].name);

      } else {
        $("#editLocationModal .modal-title").html("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal .modal-title").html("Error retrieving data");
    }
  });
});

$("#editLocationForm").on("submit", function (e) {

  e.preventDefault();

  $.ajax({
    url: path + "updateLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#editLocationID").val(),
      name: $("#editLocationName").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#editLocationModal").modal("hide");
        loadLocations();
      } else {
        $("#editLocationModal .modal-title").html("Error saving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal .modal-title").html("Error saving data");
    }
  });
});

$("#addLocationModal").on("show.bs.modal", function (e) {

  $("#addLocationForm")[0].reset();

});

$("#addLocationForm").on("submit", function (e) {

  e.preventDefault();

  $.ajax({
    url: path + "insertLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      name: $("#addLocationName").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#addLocationModal").modal("hide");
        loadLocations();
      } else {
        $("#addLocationModal .modal-title").html("Error saving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addLocationModal .modal-title").html("Error saving data");
    }
  });
});

// Location delete button is opened via JS (not data-bs-target) so the
// referential-integrity check can run first.
$("#locationTableBody").on("click", ".deleteLocationBtn", function () {

  var id = $(this).attr("data-id");
  $("#deleteLocationID").val(id);

  $.ajax({
    url: path + "checkLocationUse.php",
    type: "POST",
    dataType: "json",
    data: {
      id: id
    },
    success: function (result) {
      if (result.status.code == 200) {

        var count = parseInt(result.data[0].departmentCount, 10);

        if (count > 0) {
          $("#deleteLocationMsg").html(
            "Cannot delete &mdash; " + count + " department(s) still assigned to this location."
          );
          $("#deleteLocationConfirmBtn").prop("disabled", true);
        } else {
          $("#deleteLocationMsg").html("Are you sure you want to delete this location?");
          $("#deleteLocationConfirmBtn").prop("disabled", false);
        }

        $("#deleteLocationModal").modal("show");

      } else {
        $("#deleteLocationMsg").html("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteLocationMsg").html("Error retrieving data");
    }
  });
});

$("#deleteLocationForm").on("submit", function (e) {

  e.preventDefault();

  $.ajax({
    url: path + "deleteLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#deleteLocationID").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#deleteLocationModal").modal("hide");
        loadLocations();
      } else {
        $("#deleteLocationModal .modal-title").html("Error deleting data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteLocationModal .modal-title").html("Error deleting data");
    }
  });
});

// =================================================================
// FILTER MODAL
// =================================================================

$("#filterPersonnelModal").on("show.bs.modal", function (e) {

  // Populate department dropdown
  $.ajax({
    url: path + "getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {

        $("#filterDepartment").html("");
        $("#filterDepartment").append($("<option>", { value: "", text: "All departments" }));

        $.each(result.data, function () {
          $("#filterDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $("#filterDepartment").val(personnelFilter.departmentID);
      }
    }
  });

  // Populate location dropdown
  $.ajax({
    url: path + "getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {

        $("#filterLocation").html("");
        $("#filterLocation").append($("<option>", { value: "", text: "All locations" }));

        $.each(result.data, function () {
          $("#filterLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $("#filterLocation").val(personnelFilter.locationID);
      }
    }
  });
});

$("#filterPersonnelForm").on("submit", function (e) {

  e.preventDefault();

  personnelFilter.departmentID = $("#filterDepartment").val();
  personnelFilter.locationID = $("#filterLocation").val();

  $("#filterPersonnelModal").modal("hide");
  loadPersonnel();
});

$("#filterClearBtn").click(function () {

  personnelFilter = { departmentID: "", locationID: "" };

  $("#filterPersonnelModal").modal("hide");
  loadPersonnel();
});
