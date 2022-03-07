let data = [];
const employeeData = {id:"", firstName:"", lastName:"", gender:"", birthDate:"", hireDate:""}; //oggetto dati di un singolo impiegato
let nextId = 10006;
let id;
let firstPage = 0;
let totalPages;
let currentPage = 0;
const defaultPath = "http://localhost:8080";

$(document).ready(function () {

  getData();

  //aggiunge un nuovo dipendente
  $("#create-employee-form").submit(function (e) {
    e.preventDefault();
    let firstName = $("#nome").val();
    let lastName = $("#cognome").val();
    let gender = $('input[name=sesso]:checked', '#create-employee-form').val();
    let birthDate = $("#data-nascita").val();
    let hireDate = $("#data-assunzione").val();

    //ripropone la lista con i nuovi valori
    displayEmployeeList();

    //nasconde il modal
    $("#create-employee").hide();
    //senza di questo il backdrop del modal non viene rimosso
    $('.modal-backdrop').remove();
  });

  $("body").on("click", ".delete-employee", function () {
    id = $(this).parent("td").data("id");
    $.ajax({
      method: "DELETE",
      url: `${defaultPath}/employees/${id}`
    })
      .done(function (msg) {
        getData();
        displayEmployeeList();
      });
  });

  $("body").on("click", ".edit-employee", function () {

    id = $(this).parent("td").data("id");
    getEmployeeData(id);
  });

  //modifica le informazioni di dipendente
  $("#edit-employee-form").submit(function (e) {
    e.preventDefault();
    getNewEmployeeData();
    editEmployee(); //put request

    //ripropone la lista con i nuovi valori
    displayEmployeeList();

    //nasconde il modal
    $("#edit-employee").hide();
    //senza di questo il backdrop del modal non viene rimosso
    $('.modal-backdrop').remove();
  });

  $("body").on("click", ".page-item", function () {
    currentPage = $(this).data('page');
    getData();
  });
});

function getData() {
  $.ajax({
    method: "GET",
    url: `${defaultPath}/employees?page=${currentPage}&size=${5}`
  })
    .done(function (msg) {
      data = msg['_embedded']['employees'];
      nextPage = msg['_links']['next']['href'];
      totalPages = msg['page']['totalPages'];
      displayEmployeeList();
      displayPagination();
    });
}

function getEmployeeData(id) {
  $.ajax({
    method: "GET",
    url: `${defaultPath}/employees/${id}`
  })
    .done(function (msg) {
      employeeData.id = msg.id;
      employeeData.firstName = msg.firstName;
      employeeData.lastName = msg.lastName;
      employeeData.gender = msg.gender;
      employeeData.birthDate = msg.birthDate;
      employeeData.hireDate = msg.hireDate;
      openModal();
    });
}

function getNewEmployeeData(){
  employeeData.firstName = $("#nome-edit").val();
  employeeData.lastName = $("#cognome-edit").val();
  employeeData.gender = $('input[name=sesso-edit]:checked', '#edit-employee-form').val();
  employeeData.birthDate = $("#data-nascita-edit").val();
  employeeData.hireDate = $("#data-assunzione-edit").val();
}

function editEmployee(){
  $.ajax({
    method: "PUT",
    url: `${defaultPath}/employees/${employeeData.id}`,
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(employeeData)
    //data: "id=employeeData.id&firstName=employeeData.firstName&lastName=employeeData.lastName&gender=employeeData.gender&birthDate=employeeData.birthDate&hireDate=employeeData.hireDate"
  })
  .done(function (msg) {
    location.reload();
  });
}

function displayEmployeeList() {
  let rows = '';
  $.each(data, function (index, value) {
    rows += '<tr>';
    rows += '<td>' + value.id + '</td>';
    rows += '<td>' + value.firstName + '</td>';
    rows += '<td>' + value.lastName + '</td>';
    rows += '<td>' + value.gender + '</td>';
    rows += '<td>' + value.birthDate + '</td>';
    rows += '<td>' + value.hireDate + '</td>';
    rows += '<td data-id="' + value.id + '">';
    rows += '<button class="btn btn-success edit-employee me-2"><i class="fa-solid fa-pen"></i></button>';
    rows += '<button class="btn btn-danger delete-employee"><i class="fa-solid fa-trash-can"></i></button>';
    rows += '</td>';
    rows += '</td>';
  });
  $("tbody").html(rows);
}

function openModal(){
  console.log(employeeData.firstName);
        var myModal = new bootstrap.Modal(document.getElementById("edit-employee"), {});
        myModal.show();
        $('#nome-edit').val(employeeData.firstName);
        $('#cognome-edit').val(employeeData.lastName);

        if (employeeData.gender === "M") {
          $('#edit-sesso-m').prop("checked", true);
        } else {
          $('#edit-sesso-f').prop("checked", true);
        }

        $('#data-nascita-edit').val(employeeData.birthDate);
        $('#data-assunzione-edit').val(employeeData.hireDate);
}

function displayPagination() {
  let code = '';
  let dataPage = currentPage;

  code += '<nav aria-label="Page navigation example">';
  code += '<ul class="pagination justify-content-center">';

  if (currentPage === 0) {
    code += '<li class="disabled" data-page="' + (currentPage - 1) + '"> ' +
      '<a class="page-link" href="#" aria-label="Previous">' +
      '<span aria-hidden="true">&laquo;</span></a></li>';
  } else {
    code += '<li class="page-item" data-page="' + (currentPage - 1) + '"> ' +
      '<a class="page-link" href="#" aria-label="Previous">' +
      '<span aria-hidden="true">&laquo;</span></a></li>';
  }

  if (currentPage != 0 && currentPage != 1) {
    code += '<li class="page-item" data-page="' + firstPage + '"><a class="page-link" href="#">' + (firstPage + 1) + '</a></li>'
    if (currentPage != 2)
      code += '<li class="disabled"><a class="page-link" >...</a></li>'
  }

  for (let i = getStartPage(); i < currentPage + 2; i++) {
    dataPage = i;
    if (i === currentPage) { //Per far sì che l'elemento venga segnato come active
      code += '<li class="page-item active" data-page="' + dataPage + '"><a class="page-link" href="#">' + (dataPage + 1) + '</a></li>'
    } else {
      code += '<li class="page-item" data-page="' + dataPage + '"><a class="page-link" href="#">' + (dataPage + 1) + '</a></li>'
    }
    if (currentPage == totalPages - 2) {
      break;
    }
  }

  if (currentPage != totalPages - 2) {
    code += '<li class="disabled"><a class="page-link" >...</a></li>'
    code += '<li class="page-item" data-page="' + (totalPages - 2) + '"><a class="page-link" href="#">' + (totalPages + 1) + '</a></li>'
  }

  if (currentPage === totalPages) {
    code += '<li class="disabled" data-page="' + (currentPage + 1) + '"> ' +
      '<a class="page-link" href="#" aria-label="Next">' +
      '<span aria-hidden="true">&raquo</span></a></li>';
  } else {
    code += '<li class="page-item" data-page="' + (currentPage + 1) + '"> ' +
      '<a class="page-link" href="#" aria-label="Next">' +
      '<span aria-hidden="true">&raquo</span></a></li>';
  }
  $("pagination").html(code);
}

function getStartPage() {

  if (currentPage === 0) {
    return currentPage;
  } else {
    return currentPage - 1;
  }
}