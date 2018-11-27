$(document).ready(function () {
    $("#formLogin").submit(function(e) {
        e.preventDefault();
        console.log("Logou");
        // refresh page location.reload();
    })

    $("#formNewUser").submit(function(e) {
        e.preventDefault();
        const login = $("#newLogin-input").val();
        const password = $("#newPassword-input").val();
        const usuario = {
            usuario : login,
            senha: password
        };

        $.ajax({
            type: "GET",
            url: "http://rem-rest-api.herokuapp.com/api/usuarios",
            xhrFields: {
                withCredentials: true
             },
            dataType: "json",
            success: function (response) {
                const login = $("#newLogin-input").val();
                if(!checkAlreadyExistsUser(response.data, login)){
                    postUser(usuario);
                }
            }
        });
       
        //console.log(login, password);
        
        // refresh page location.reload();
    })
});

function checkAlreadyExistsUser(collection, user) {
    return collection.some(function(element, index, array){
        return element.usuario === user;
    });
}

function postUser(user) {
    $.ajax({
        type: "POST",
        url: "http://rem-rest-api.herokuapp.com/api/usuarios",
        data: user,
        dataType: "json",
        success: function (response) {
            console.log(response);
        }
    });
}


