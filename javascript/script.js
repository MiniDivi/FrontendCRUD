var data = [
    {
      "id": 10001,
      "birthDate": "1953-09-01",
      "firstName": "Georgi",
      "lastName": "Facello",
      "gender": "M",
      "hireDate": "1986-06-25",
    },
    {
      "id": 10002,
      "birthDate": "1964-06-01",
      "firstName": "Bezalel",
      "lastName": "Simmel",
      "gender": "F",
      "hireDate": "1985-11-20",
    },
    {
      "id": 10003,
      "birthDate": "1959-12-02",
      "firstName": "Parto",
      "lastName": "Bamford",
      "gender": "M",
      "hireDate": "1986-08-27",
    },
    {
      "id": 10004,
      "birthDate": "1954-04-30",
      "firstName": "Chirstian",
      "lastName": "Koblick",
      "gender": "M",
      "hireDate": "1986-11-30",
  
    },
    {
      "id": 10005,
      "birthDate": "1955-01-20",
      "firstName": "Kyoichi",
      "lastName": "Maliniak",
      "gender": "M",
      "hireDate": "1989-09-11",
  
    }
  ];

let nextId = 10006;
let id;


$(document).ready(function() {
    displayEmployeeList();

    //aggiunge un nuovo dipendente
    $("#create-employee-form").submit(function(e){
      e.preventDefault();
      let firstName = $("#nome").val();
      let lastName = $("#cognome").val();
      let gender = $('input[name=sesso]:checked', '#create-employee-form').val();
      let birthDate = $("#data-nascita").val();
      let hireDate = $("#data-assunzione").val();

      data.push({id: nextId, birthDate: birthDate, firstName: firstName, lastName: lastName, gender: gender, hireDate: hireDate});
      nextId++;

      //ripropone la lista con i nuovi valori
      displayEmployeeList();

      //nasconde il modal
      $("#create-employee").hide();    
      //senza di questo il backdrop del modal non viene rimosso
      $('.modal-backdrop').remove(); 
    });

    $("body").on("click",".delete-employee", function(){
      id = $(this).parent("td").data("id");
      for(let i = 0; i < data.length; i++){
        if(data[i].id == id){
          data.splice(i, 1);
          break;
        }
      }
      displayEmployeeList();
    });

    $("body").on("click",".edit-employee", function(){
      id =  $(this).parent("td").data("id");
      for(let i = 0; i < data.length; i++){
        if(data[i].id == id){
          var myModal = new bootstrap.Modal(document.getElementById("edit-employee"), {});
            myModal.show();
            $('#nome-edit').val(data[i].firstName);
            $('#cognome-edit').val(data[i].lastName);

            if(data[i].gender === "M"){
              $('#edit-sesso-m').prop("checked", true);
            } else {
              $('#edit-sesso-f').prop("checked", true);
            }

            $('#data-nascita-edit').val(data[i].birthDate);
            $('#data-assunzione-edit').val(data[i].hireDate);
            break;
        }
      }
    });

        //modifica le informazioni di dipendente
        $("#edit-employee-form").submit(function(e){
          e.preventDefault();
          let firstName = $("#nome-edit").val();
          let lastName = $("#cognome-edit").val();
          let gender = $('input[name=sesso-edit]:checked', '#edit-employee-form').val();
          let birthDate = $("#data-nascita-edit").val();
          let hireDate = $("#data-assunzione-edit").val();
          
          for(let i = 0; i < data.length; i++){
            if(data[i].id == id){
              console.log(firstName);
              data[i].firstName = firstName;
              data[i].lastName = lastName;
              data[i].gender = gender;
              data[i].birthDate = birthDate;
              data[i].hireDate = hireDate;
            }
          }
  
          //ripropone la lista con i nuovi valori
          displayEmployeeList();
    
          //nasconde il modal
          $("#edit-employee").hide();    
          //senza di questo il backdrop del modal non viene rimosso
          $('.modal-backdrop').remove(); 
        });
    


});
    
    function displayEmployeeList(){
        let rows = '';
        $.each(data, function(index, value) {
            rows += '<tr>';
            rows += '<td>' + value.id + '</td>';
            rows += '<td>' + value.firstName + '</td>';
            rows += '<td>' + value.lastName + '</td>';
            rows += '<td>' + value.gender + '</td>';
            rows += '<td>' + value.birthDate + '</td>';
            rows += '<td>' + value.hireDate + '</td>';
            rows += '<td data-id="'+value.id+'">';
                rows += '<button class="btn btn-success edit-employee me-2"><i class="fa-solid fa-pen"></i></button>';
                rows += '<button class="btn btn-danger delete-employee"><i class="fa-solid fa-trash-can"></i></button>';
                rows += '</td>';
            rows += '</td>'; 
        });
        $("tbody").html(rows);
    }