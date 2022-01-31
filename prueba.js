$(document).ready(function () {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyAadZbLUFsKAA_I_QHHKutJV3cGQVN8PZQ",
      authDomain: "fir-app-803a6.firebaseapp.com",
      projectId: "fir-app-803a6",
      storageBucket: "fir-app-803a6.appspot.com",
      messagingSenderId: "96609297718",
      appId: "1:96609297718:web:871a4e2eacfffbcd5dbf97",
      measurementId: "G-ZWC3MFZC1Q"
    };
  
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
  
    // Inicializar Auth de Firebase
    const auth = firebase.auth();
  
    // Inicializar Auth de Google
    var provider = new firebase.auth.GoogleAuthProvider();

    // Inicializar Auth de Facebook
    var provider = new firebase.auth.FacebookAuthProvider();
  
    // Inicializar Firestore (Base de datos)
    const db = firebase.firestore();
  
    // Rergistrar los usuarios
    // Si no esta registrado, debe hacer click en boton registrar
    $("#btnRegistro").click(function (e) {
      e.preventDefault();
      // Esto hará que el login desaparezca
      $("#login").hide();
      // Esto hara que el formulario de registro aparezca
      $(".registro-usuario").show();
    })
  
    $("#registrate").click(function (e) {
      $("#btnRegistroConEmail").removeClass("d-none");
      $("#registrateAviso").addClass("d-none");
      $("#btnRegistroConEmail").addClass("d-block");
      $("#btnIngresoConEmail").addClass("d-none");
      $("#btnIngresoGmail").addClass("d-none");
      $("#btnIngresoFacebook").addClass("d-none");

    })
  
    // Si se completa el formulario de registro y se envia, registra al nuevo usuario y se guarda la sesion
    $("#btnRegistroConEmail").click(function (e) {
      e.preventDefault();
      // Capturamos los datos enviados por el formulario de registro
      // Campo email
      var email = $("#IngresoEmail").val();
      //Campo Password
      var password = $("#ingresoPassword").val();
      // Metodo de firebase que permite registro de usarios con email
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          // limpiar formulario de registro
          $("#IngresoEmailForm").trigger("reset");
        })
        .catch((error) => { // Esto permite capturar el error, se puede trabajar este catch con los codigos de error
          var errorCode = error.code;
          var errorMessage = error.message;
          // Muestro en la consola el codigo de error y el mensaje de error
          if (error.code == 'auth/email-already-in-use') {
            $("#alert-login-registro").removeClass("d-none");
            $("#alert-login-registro").addClass("d-block");
          }
        });
  
    })
    // Acceso de usuarios
    // Ingresar por email
    $("#btnIngresoEmail").click(function (e) {
      e.preventDefault();
      // Mostramos formulario de ingreso por email
      $("#IngresoEmail").show();
      // Ocultamos boton de ingreso por email
      $("#btnIngresoEmail").hide();
    })
  
    // Si ingresamos por correo y password mostramos formulario de ingreso 
    $("#btnIngresoConEmail").click(function (e) {
      e.preventDefault();
      // Capturamos los datos enviados por el formulario de ingreso
      // Campo email
      var email = $("#ingresoEmail").val();
      // Campo Password
      var password = $("#ingresoPassword").val();
      // Metodo que permite ingreso de usarios con email
      try {
        auth
          .signInWithEmailAndPassword(email, password)
          .then(userCredential => {
            // limpiar formualrio de ingreso
            $("#IngresoEmail").trigger("reset");
            $("#alert-login").hide();
            $("#alert-login-registro").hide();
          })
          .catch((error) => {// Esto permite capturar el error, se puede trabajar este catch con los codigos de error
            var errorCode = error.code;
            var errorMessage = error.message;
            // Muestro en la consola el codigo de error y el mensaje de error
            console.log(errorCode, errorMessage);
          });
      } catch (error) {
        if (error.code == 'auth/argument-error') {
          $("#alert-login").removeClass("d-none");
          $("#alert-login").addClass("d-block");
        }
      }
  
    })
    
    // Ingresar con google
    $("#btnIngresoGmail").click(function (e) {
      e.preventDefault();
      auth.signInWithPopup(provider)
        .then(result => {
          console.log("Ingreso con Google");
        })
        .catch(err => {
          console.log(err);
        })
    })
  

    

    //Ingresar con facebook 
    $("#btnIngresoFacebook").click(function (e) {
      e.preventDefault();
      auth.signInWithPopup(provider)
        .then(result => {
          console.log("Ingreso con Facebook");
        })
        .catch(err => {
          console.log(err);
        })
    })
  
    // Desconexion de Usuarios
    // Boton LogOut
    $("#logout").click(function (e) {
      e.preventDefault();
      auth.signOut().then(() => {
        console.log("Log Out");
      })
    })
  
    // Ver si sesion esta activa
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Si usuario esta conectado
        // ocultamos el login
        $("#login").hide();
        // mostramos el contenido
        $("#contenidoWeb").show();
        obtienePosts();
        $("#postList").show();
      } else {
        // Si usuario esta desconectado
        // Se oculta contenido de web
        $("#contenidoWeb").hide();
        // Se muestra el login
        $("#login").show()
        $("#postList").hide();
        $("#btnRegistroConEmail").addClass("d-none");
        $("#btnIngresoConEmail").removeClass("d-none");
        $("#btnIngresoConEmail").addClass("d-block");
        $("#btnIngresoGmail").addClass("d-block");
        $("#btnIngresoFacebook").addClass("d-block");
        $("#registrateAviso").removeClass("d-none");
        $("#registrateAviso").addClass("d-block");
      }
    });
  
    // Boton enviar formulario post
    $("#btnSendPost").click(function (e) {
      e.preventDefault();
      // Capturo los datos enviados desde el formulario con id "postForm"
      var mensaje = $("#postText").val();
  
      if (mensaje.length > 0) {
        // Metodo de escritura para añadir elementos a la coleccion "post", 
        // si la coleccion no existe, la crea implicitamente
        var d = new Date();
        var strDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
        var strHours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        db.collection("posts").add({
          mensaje: mensaje,
          fecha: strDate,
          hora: strHours
        })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            // Reseteo el formulario de registro de paises
            $("#postForm").trigger("reset");
            // Invoco al metodo obtienePosts()
            obtienePosts();
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else {
        alert('Please! fill in all the fields');
      }
  
    });
  
    $("#btnSavePost").click(function (e) {
      e.preventDefault();
      // Capturo los datos enviados desde el formulario con id "postForm"
      var mensaje = $("#postText").val();
      var id = $("#idPost").val();
      console.log(id)
      if (mensaje.length > 0) {
        // Metodo de escritura para añadir elementos a la coleccion "post", 
        // si la coleccion no existe, la crea implicitamente
        var d = new Date();
        var strDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
        var strHours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        db.collection("posts").doc(id).update({
          mensaje: mensaje,
          fecha: strDate,
          hora: strHours
        })
          .then(() => {
            // Reseteo el formulario de registro de post
            $("#postForm").trigger("reset");
            // Invoco al metodo obtienePosts()
            obtienePosts();
            $("#btnSendPost").removeClass("d-none");
            $("#btnSendPost").addClass("d-block");
            $("#btnSavePost").removeClass("d-block");
            $("#btnSendPost").addClass("d-none");
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else {
        alert('Please! fill in all the fields');
      }
  
    });
  
    // Metodo que sirve para mostrar los post en la tabla
    function postList(data) {
      $("#postList").empty();
      if (data.length > 0) {
        let html = '';
        data.forEach(doc => {
          const post = doc.data();
          const div = `
            <div class="card bg-dark text-white  mt-3 mx-auto" style="border-radius: 1rem; width: 800px;">
              <div class="card-body">
                <p>${post.mensaje}</p>
                <p>Posted on ${post.fecha} at ${post.hora}</p>
                <button data-id="${doc.id}" class="btn btn-success btn-edit-post bi bi-pencil-fill">
                Edit
                </button>
                <button data-id="${doc.id}" class="btn btn-danger btn-delete-post bi bi-trash-fill">
                Remove
                </button>
              </div>
            </div>
          `;
          html += div;
        });
        $("#postList").append(html);
        // Agregar escucha a todos los botones delete
        const btnsDelete = document.querySelectorAll(".btn-delete-post");
        btnsDelete.forEach(btn => {
          btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            deletePost(id);
          })
        })
        // Agregar escucha a todos los botones edit
        const btnsEdit = document.querySelectorAll(".btn-edit-post");
        btnsEdit.forEach(btn => {
          btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            obtienePost(id);
          })
        })
      }
    };
  
    // Metodo que permite obtener los datos de la BD
    function obtienePosts() {
      db.collection("posts").get().then((snapshot) => {
        postList(snapshot.docs);
      })
    };
    function obtienePost(id) {
      db.collection("posts").doc(id).get().then((doc) => {
        // Si existe objeto, paso sus datos al formulario
        var post = doc.data()
        $("#postText").val(post.mensaje);
        $("#idPost").val(id);
        $("#btnSendPost").removeClass("d-block");
        $("#btnSendPost").addClass("d-none");
        $("#btnSavePost").removeClass("d-none");
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    }
    // Metodo que elimina registros
    function deletePost(id) {
      db.collection("posts").doc(id).delete().then(() => {
        // Si elimina Actualiza la tabla
        obtienePosts();
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    }
  });