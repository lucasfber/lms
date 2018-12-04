$(document).ready(function() {

  function checkEmptyBasket() {
    if (localStorage.getItem("shoppingBasket") !== null) {
      let shoppingBasket = JSON.parse(localStorage.getItem("shoppingBasket"));
      if (shoppingBasket.length > 0) {
        shoppingBasket.forEach(p => renderFromShoppingBasket(p));
      } else {
        $(".btn-finalizar").hide();
      }
    }
  }

  function renderProducts() {
    const PRODUCTS = getProducts();

    PRODUCTS.forEach(p => createProduct(p));
    handleClickButtonsEvent();
  }

  function handleClickButtonsEvent() {
    $(".btnAdd").click(function(e) {
      $(".btn-finalizar").show();
      renderShoppingBasket(parseInt(e.target.id));
    });
  }

  function createProduct(product) {
    let productSection = $("#products-section");

    let divCol = $("<div></div>");
    divCol.addClass("col-md-3");

    let divThumbnail = $("<div></div>");
    divThumbnail.addClass("thumbnail");

    let productPicture = $("<img />");
    productPicture.attr("src", product.pic);

    let divCaption = $("<div></div>");
    divCaption.addClass("caption");

    let productTitle = $(`<h3>${product.description}</h3>`);
    let productPrice = $(`<h4>R$ ${product.price}</h4>`);

    let productControls = $("<div></div>");

    let btnAddProduct = $("<button></button>");
    btnAddProduct.addClass("btn btn-primary btn-sm btnAdd");
    btnAddProduct.attr("id", product.id);
    btnAddProduct.text("Adicionar à Cesta");

    let labelQuantity = $("<label></label>");
    labelQuantity.text("Unid:");

    let inputQuantity = $("<input />");
    inputQuantity.attr("type", "number");
    inputQuantity.addClass("form-control input-qtd");
    inputQuantity.attr("min", 1);
    inputQuantity.attr("value", 1);
    inputQuantity.attr("id", `prod${product.id}`);

    productControls.addClass("product-controls");
    productControls.append(btnAddProduct);
    productControls.append(labelQuantity);
    productControls.append(inputQuantity);

    divCaption.append(productTitle);
    divCaption.append(productPrice);
    divCaption.append(productControls);

    divThumbnail.append(productPicture);
    divThumbnail.append(divCaption);

    divCol.append(divThumbnail);

    productSection.append(divCol);
  }

  function checkUserLogged() {
    if (localStorage.getItem("currentUser") === null) {
      $(".product-controls").hide();
      $("#myDropdown").hide();
      $(".btn-logout").hide();
    } else {
      $("#btnSignIn").hide();
      $("#btnSignUp").hide();
    }
  }

  function hideAlerts() {
    $("#alert-error-login").hide();
    $("#alert-login-exists").hide();
    $("#alert-success-signup").hide();
  }

  function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
  }

  function handleLogout() {
    $("#btnLogout").click(function() {
      logout();
    });
  }

  function checkLoginAndPassword(collection, user, password) {
    return collection.some(function(element, index, array) {
      if (element.usuario === user) {
        return element.senha === password;
      }
    });
  }

  function addUserToLocalStorage(user) {
    localStorage.setItem("currentUser", user);
  }

  function createShoppingBasket() {
    let shoppingBasket = [];
    localStorage.setItem("shoppingBasket", JSON.stringify(shoppingBasket));
  }

  function clearInputFields(user, password) {
    user.val("");
    password.val("");
  }

  function handleLogin() {
    $("#formLogin").submit(function(e) {
      e.preventDefault();

      const loginInput = $("#login-input");
      const passwordInput = $("#password-input");

      $.ajax({
        type: "GET",
        url: "http://rem-rest-api.herokuapp.com/api/usuarios",
        xhrFields: { withCredentials: true },
        dataType: "json",
        success: function(response) {
          if (
            checkLoginAndPassword(
              response.data,
              loginInput.val(),
              passwordInput.val()
            )
          ) {
            addUserToLocalStorage(loginInput.val());
            createShoppingBasket();
            location.reload();
          } else {
            $("#alert-error-login").show();
            clearInputFields(loginInput, passwordInput);
          }
        }
      });
    });
  }

  function getProduct(id) {
    const PRODUCTS = getProducts();

    return PRODUCTS.filter(p => p.id === id)[0];
  }

  function clearShoppingBasket() {
    localStorage.removeItem("shoppingBasket");
  }

  function addToShoppingBasket(product) {
    let shoppingBasket = JSON.parse(localStorage.getItem("shoppingBasket"));
    shoppingBasket.push(product);

    localStorage.setItem("shoppingBasket", JSON.stringify(shoppingBasket));
  }

  function renderShoppingBasket(productId) {
    let product = getProduct(productId);
    let quantityProduct = $(`#prod${product.id}`).val();

    let myDropdown = $(".my-dropdown");
    myDropdown.removeClass("empty-shopping-basket");
    let infoWrapper = $(".info-wrapper");

    infoWrapper.hide();

    let productDiv = $("<div></div>");
    productDiv.addClass("product");

    let productThumbnail = $("<img />").attr("src", product.pic);
    productThumbnail.addClass("product-thumbnail");
    productThumbnail.attr("alt", "Product Image");

    productDiv.append(productThumbnail);

    let productPriceDiv = $("<div></div>");
    productPriceDiv.addClass("product-price");

    let productName = $(`<p>${product.description}</p>`);
    productName.addClass("product-name");

    let quantity = $(`<small>Quantidade: ${quantityProduct}</small>`);
    quantity.addClass("quantity");

    let productPrice = $(`<p>R$ ${quantityProduct * product.price}</p>`);
    productPrice.addClass("price");

    productPriceDiv.append(productName);
    productPriceDiv.append(quantity);
    productPriceDiv.append(productPrice);

    productDiv.append(productPriceDiv);

    myDropdown.append(productDiv);

    let p = { ...product, quantity: quantityProduct };
    addToShoppingBasket(p);
  }

  function postUser(user) {
    $.ajax({
      type: "POST",
      url: "http://rem-rest-api.herokuapp.com/api/usuarios",
      data: JSON.stringify(user),
      dataType: "json",
      xhrFields: { withCredentials: true },
      success: function(response) {
      }
    });
  }

  function checkAlreadyExistsUser(collection, user) {
    return collection.some(function(element, index, array) {
      return element.usuario === user;
    });
  }

  function handleSignUp() {
    $("#formNewUser").submit(function(e) {
      e.preventDefault();
      const loginInput = $("#newLogin-input");
      const passwordInput = $("#newPassword-input");
      const usuario = {
        usuario: loginInput.val(),
        senha: passwordInput.val()
      };

      $.ajax({
        type: "GET",
        url: "http://rem-rest-api.herokuapp.com/api/usuarios",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function(response) {
          const login = $("#newLogin-input").val();
          if (!checkAlreadyExistsUser(response.data, login)) {
            postUser(usuario);
            $("#alert-success-signup").show();
          } else {
            $("#alert-login-exists").show();
            clearInputFields(loginInput, passwordInput);
          }
        }
      });
    });
  }

  function renderFromShoppingBasket(product) {
    let myDropdown = $(".my-dropdown");

    myDropdown.removeClass("empty-shopping-basket");
    let infoWrapper = $(".info-wrapper");

    infoWrapper.hide();

    let productDiv = $("<div></div>");
    productDiv.addClass("product");

    let productThumbnail = $("<img />").attr("src", product.pic);
    productThumbnail.addClass("product-thumbnail");
    productThumbnail.attr("alt", "Product Image");

    productDiv.append(productThumbnail);

    let productPriceDiv = $("<div></div>");
    productPriceDiv.addClass("product-price");

    let productName = $(`<p>${product.description}</p>`);
    productName.addClass("product-name");

    let quantity = $(`<small>Quantidade: ${product.quantity}</small>`);
    quantity.addClass("quantity");

    let productPrice = $(`<p>R$ ${product.quantity * product.price}</p>`);
    productPrice.addClass("price");

    productPriceDiv.append(productName);
    productPriceDiv.append(quantity);
    productPriceDiv.append(productPrice);

    productDiv.append(productPriceDiv);

    myDropdown.append(productDiv);
  }

  function getProducts() {
    const PRODUCTS = [
      {
        id: 1,
        description: "Game - Red Dead Redemption 2 - PS4",
        price: 229.0,
        pic: "img/prod1.jpg"
      },
      {
        id: 2,
        description: "Game Call of Duty WW II - PS4",
        price: 99.0,
        pic: "img/prod2.jpg"
      },
      {
        id: 3,
        description: "Console Xbox One 500GB",
        price: 1620,
        pic: "img/prod3.jpg"
      },
      {
        id: 4,
        description: "Controle sem Fio - Dualshock 4 - PS4",
        price: 231.0,
        pic: "img/prod4.jpg"
      }
    ];

    return PRODUCTS;
  }

  /** function calls() */
  checkEmptyBasket();
  renderProducts();
  checkUserLogged();
  hideAlerts();
  handleLogout();
  handleLogin();
  handleSignUp();

}); //end document.ready()
