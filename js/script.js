//variabili per i dati degli impiegati
let data = []; //variabile che conterrà gli impiegati e i loro dati

//oggetto dati di un singolo impiegato
const employeeData = {
    id: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    hireDate: ""
};

//variabili per la paginazione
let nextPage;
let lastPage;
let firstPage = 0;

//variabili generali
let editEmployee = true; //Serve per sapere se il form nel modal servirà per aggiungere o moficare un impiegato 
const defaultPath = "http://localhost:8080/index.php";

$(document).ready(function () {
    getData(); //prendo i dati dal server

    //Se nel localStorage l'item currentPage non ha valore, viene inizializzato a 0.
    if (localStorage.getItem("currentPage") === null) {
        localStorage.setItem("currentPage", 0);
    }

    //cosa fare quando viene cliccato il bottone per eliminare un impiegato
    $("body").on("click", ".employee-delete-button", function () {
        id = $(this).parent("td").data("id");
        deleteEmployee(id);
    });

    //cosa fare quando viene cliccato il bottone per aggiungere un impiegato
    $("body").on("click", "#trigger-modal-button", function () {
        $("#employee-submit-button").removeAttr("hidden");
        $("#employee-edit-button").attr("hidden", "hidden");
        editEmployee = false; //Serve per sapere se il form nel modal servirà per aggiungere o moficare un impiegato 
    });

    //cosa fare quando viene cliccato il bottone per modificare un impiegato
    $("body").on("click", ".employee-edit-button", function () {
        id = $(this).parent("td").data("id"); //recupero l'id dell'impiegato
        $("#employee-edit-button").removeAttr("hidden");
        $("#employee-submit-button").attr("hidden", "hidden");
        getEmployeeData(id); // recupero i dati dell'impiegato
        editEmployee = true; //Serve per sapere se il form nel modal servirà per aggiungere o moficare un impiegato 

    });

    //cosa fare in caso di submit del modal
    $("#employee-form").submit(function (e) {
        e.preventDefault();
        //se l'impiegato inserito è da aggiungere
        if (!editEmployee) {
            //recupero le informazioni inserite negli input field
            getFormEmployeeData();
            //eseguo una chiamata POST per aggiungere il nuovo dipendente
            createEmployee();
        }
        // se bisogna modificare le informazioni di un impiegato
        else {
            //recupero le nuove informazioni inserite negli input field
            getFormEmployeeData();
            //eseguo la chiamata PUT per modificare le informazioni del dipendente
            editEmployeePUT();
        }
    });

    $("body").on("click", ".page-item", function () {
        localStorage.setItem("currentPage", $(this).data('page'));
        getData();
    });
});
//mostra la lista degli impiegati
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
        rows += '<button class="btn btn-success employee-edit-button me-2" data-bs-toggle="modal" data-bs-target="#employee-modal" data-bs-event="@addEmployee"><i class="fa-solid fa-pen"></i></button>';
        rows += '<button class="btn btn-danger employee-delete-button"><i class="fa-solid fa-trash-can"></i></button>';
        rows += '</td>';
        rows += '</td>';
    });
    $("tbody").html(rows);
}
//chiamata GET (per ricevere dal server tutti gli impiegati)
function getData() {
    $.ajax({
        method: "GET",
        url: `${defaultPath}/employees?page=${parseInt(localStorage.getItem("currentPage"))}&size=${5}`,
        dataType: "json",
        contentType: "application/json",
        
    })
        .done(function (msg) {
            data = msg['_embedded']['employees'];
            totalPages = msg['page']['totalPages'];

            if (parseInt(localStorage.getItem("currentPage")) > (totalPages - 1)) {
                nextPage = msg['_links']['next']['href'];
            }
            displayEmployeeList(); //mostro la lista degli impiegati
            displayPagination(); //mostro la paginazione
        });
}
//chiamata GET (per ricevere dal server l'impiegato richiesto)
function getEmployeeData(id) {
    $.ajax({
        method: "GET",
        url: `${defaultPath}/employees?id=${id}`,
        dataType: "json",
        contentType: "application/json"
    })
        .done(function (msg) {
            employeeData.id = msg.id;
            employeeData.firstName = msg.firstName;
            employeeData.lastName = msg.lastName;
            employeeData.gender = msg.gender;
            employeeData.birthDate = msg.birthDate;
            employeeData.hireDate = msg.hireDate;
            setFormEmployeeData();
        });
}
//chiamata POST (per creare un nuovo impiegato)
function createEmployee() {
    $.ajax({
        method: "POST",
        url: `${defaultPath}`,
        data: JSON.stringify(employeeData)
    })
        .done(function () {
            location.reload();
        });
}
//Chiamata DELETE (per eliminare un impiegato)
function deleteEmployee(id) {
    $.ajax({
        method: "DELETE",
        url: `${defaultPath}?id=${id}`
    })
        .done(function () {
            getData();
            displayEmployeeList();
        });
}
//Chiamata PUT (per modificare le informazioni di un dipendente)
function editEmployeePUT() {
    $.ajax({
        method: "PUT",
        url: `${defaultPath}/employees/${id}`,
        data: JSON.stringify(employeeData)
    })
        .done( function(){
            location.reload();
        });
}
//mette i valori del dipentente negli rispettivi input field (quando si devono modificare le informazioni del dipendente) 
function setFormEmployeeData() {
    $('#employee-name').val(employeeData.firstName);
    $('#employee-last-name').val(employeeData.lastName);
    if (employeeData.gender === "M") {
        $('#employee-gender-m').prop("checked", true)
    } else {
        $('#employee-gender-f').prop("checked", true);
    }
    $('#employee-birth-date').val(employeeData.birthDate);
    $('#employee-hire-date').val(employeeData.hireDate);
}
//ricavo le nuove informazioni che dovranno sostuire quelle già presenti
function getFormEmployeeData() {
    employeeData.firstName = $('#employee-name').val();
    employeeData.lastName = $('#employee-last-name').val();
    employeeData.gender = $('input[name=employee-gender]:checked', '#employee-form').val();
    employeeData.birthDate = $('#employee-birth-date').val();
    employeeData.hireDate = $('#employee-hire-date').val();
}
//crea la paginazione
function displayPagination() {
    let code = '';
    let dataPage = parseInt(localStorage.getItem("currentPage"));

    code += '<nav>';
    code += '<ul class="pagination justify-content-center">';

    //se l'utente è nella prima pagina, il bottone per andare alla pagina precedente sarà disabilitato
    if (parseInt(localStorage.getItem("currentPage")) === 0) {
        code += '<li class="disabled me-2"> ' +
            '<a class="page-link no-select" aria-label="Previous">' +
            '<span aria-hidden="true">&laquo;</span></a></li>';
    } else {
        code += '<li class="page-item me-2" data-page="' + (parseInt(localStorage.getItem("currentPage")) - 1) + '"> ' +
            '<a class="page-link" href="#" aria-label="Previous">' +
            '<span aria-hidden="true">&laquo;</span></a></li>';
    }

    //se la pagina corrente è maggiore o uguale a 2, il bottone corrispondente alla prima pagina verrà mostrato 
    if (parseInt(localStorage.getItem("currentPage")) >= 2) {
        code += '<li class="page-item me-2" data-page="' + firstPage + '"><a class="page-link" href="#">' + (firstPage + 1) + '</a></li>'
        //se la pagina corrente è maggiore o uguale a 3 verranno mostrati i ... dopo il bottone che indica la prima pagina
        if (parseInt(localStorage.getItem("currentPage")) >= 3)
            code += '<li class="disabled me-2"><a class="page-link" >...</a></li>'
    }

    //for che genera i bottoni per le rispettive pagine. nella condizione del for la logica scritta indica che se siamo all'ultima pagina non deve mostrare una pagina successiva
    for (let dataPage = getNavigationStartPage();
        (parseInt(localStorage.getItem("currentPage")) != totalPages - 2) ? dataPage < parseInt(localStorage.getItem("currentPage")) + 2 : dataPage < parseInt(localStorage.getItem("currentPage")) + 1; dataPage++) {
        if (dataPage === parseInt(localStorage.getItem("currentPage"))) { //Fa sì che l'elemento venga segnato come active
            code += '<li class="page-item active me-2" data-page="' + dataPage + '"><a class="page-link" href="#">' + (dataPage + 1) + '</a></li>'
        } else {
            code += '<li class="page-item me-2" data-page="' + dataPage + '"><a class="page-link" href="#">' + (dataPage + 1) + '</a></li>'
        }

    }

    if (parseInt(localStorage.getItem("currentPage")) < totalPages - 4) {
        code += '<li class="disabled me-2"><a class="page-link" >...</a></li>'
        code += '<li class="page-item me-2" data-page="' + (totalPages - 2) + '"><a class="page-link" href="#">' + (totalPages + 1) + '</a></li>'
    }

    //se l'utente è nell'ultima pagina il bottone per andare alla pagina successiva sarà disabilitato
    if (parseInt(localStorage.getItem("currentPage")) === totalPages - 2) {
        code += '<li class="disabled me-2"> ' +
            '<a class="page-link no-select" href="#" aria-label="Next">' +
            '<span aria-hidden="true">&raquo</span></a></li>';
    } else {
        code += '<li class="page-item me-2" data-page="' + (parseInt(localStorage.getItem("currentPage")) + 1) + '"> ' +
            '<a class="page-link" href="#" aria-label="Next">' +
            '<span aria-hidden="true">&raquo</span></a></li>';
    }
    $("pagination").html(code);
}
//stabilisce da dove il ciclo for che genera gli item corrispondenti alla paginazione deve partire.
function getNavigationStartPage() {

    if (parseInt(localStorage.getItem("currentPage")) === 0) {
        return parseInt(localStorage.getItem("currentPage"));
    } else {
        return parseInt(localStorage.getItem("currentPage")) - 1;
    }
}