$(document).ready(function() {
  function getShoppingBasket() {
    return JSON.parse(localStorage.getItem("shoppingBasket"));
  }

  function renderTable(shoppingBasket) {
    if (shoppingBasket !== null) {
      let tbody = $(".tbody");
      let totalPrice = $("<h3></h3>");

      shoppingBasket.forEach(p => {
        let tr = $("<tr></tr>");

        let tPic = $(`<td></td>`);
        let thumbProduct = $("<img />");
        thumbProduct.attr("src", p.pic);
        thumbProduct.addClass("thumb");
        tPic.append(thumbProduct);

        let tDesc = $(`<td>${p.description}</td>`);
        let tPrice = $(`<td>RS ${p.price}</td>`);
        let tQtd = $(`<td>${p.quantity}</td>`);

        tr.append(tPic);
        tr.append(tDesc);
        tr.append(tPrice);
        tr.append(tQtd);

        tbody.append(tr);
      });
    }
  }

  function getTotalPrice() {
    const shoppingBasket = getShoppingBasket();
    if (shoppingBasket !== null) {
      let totalPrice = 0;
      shoppingBasket.forEach(p => (totalPrice += p.price * p.quantity));
      return totalPrice;
    }
    return 0;
  }

  function renderCheckoutSection() {
    let divColMd = $(".checkout-wrapper");

    let checkoutSection = $("<div></div>");
    checkoutSection.addClass("jumbotron checkout-section");

    let divTotalPrice = $("<div></div>");

    let headingTotalPrice = $("<h4></h4>");
    headingTotalPrice.text("Valor Total: ");

    let spanTotalPrice = $("<span></span>");
    spanTotalPrice.addClass("totalPrice");
    spanTotalPrice.text(`R$ ${getTotalPrice()}`);

    headingTotalPrice.append(spanTotalPrice);

    divTotalPrice.append(headingTotalPrice);

    let btnDone = $("<button></button>");
    btnDone.addClass("btn btn-danger btn-lg btnDone");
    btnDone.text("Finalizar Compra");

    checkoutSection.append(divTotalPrice);
    checkoutSection.append("<hr />");
    checkoutSection.append(btnDone);

    divColMd.append(checkoutSection);
  }

  function getPurchasesByUser(purchases) {
    const currentUser = localStorage.getItem("currentUser");
    return purchases.filter(p => p.user === currentUser);
  }

  function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
  }

  function getPurchaseDate(time) {
    const date = new Date(time);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  }

  function getPurchaseHour(time) {
    const date = new Date(time);
    return `${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`;
  }

  function createPurchasesDone(purchase) {
    let panel = $("<div></div>");
    panel.addClass("panel panel-primary");

    let panelHeading = $("<div></div>");
    panelHeading.addClass("panel-heading");

    panelTitle = $("<h3></h3>");
    panelTitle.addClass("panel-title");
    panelTitle.text(`Compra #${purchase.id}`);

    panelHeading.append(panelTitle);

    let panelBody = $("<div></div>");
    panelBody.addClass("panel-body");

    panelBody.append(
      `<p>Data da compra: <span class="purchase-info">${getPurchaseDate(
        purchase.date
      )}</span></p>`
    );
    panelBody.append(
      `<p>Hora da compra: <span class="purchase-info">${getPurchaseHour(
        purchase.date
      )}</span></p>`
    );
    panelBody.append(
      `<h4>Valor Total: <span class="purchase-info">R$ ${
        purchase.totalPrice
      }</span></h4>`
    );

    panel.append(panelHeading);
    panel.append(panelBody);

    return panel;
  }

  function renderPurchasesDoneSection() {
    $.ajax({
      type: "GET",
      url: "http://rem-rest-api.herokuapp.com/api/compras",
      xhrFields: {
        withCredentials: true
      },
      dataType: "json",
      success: function(response) {
        let currentUserPurchases = getPurchasesByUser(response.data);
        if (currentUserPurchases != null) {
          let purchasesDoneSection = $("#purchases-done-wrapper");
          purchasesDoneSection.html("");

          currentUserPurchases.forEach(p => {
            let purchase = createPurchasesDone(p);
            purchasesDoneSection.append(purchase);
          });
        }
      }
    });
  }

  function clearShoppingBasket() {
    localStorage.setItem("shoppingBasket", JSON.stringify([]));
  }

  function handlePurchaseDone() {
    $(".btnDone").click(function() {
      let purchase = {
        totalPrice: getTotalPrice(),
        date: Date.now(),
        user: localStorage.getItem("currentUser")
      };

      $.ajax({
        type: "POST",
        url: "http://rem-rest-api.herokuapp.com/api/compras",
        xhrFields: { withCredentials: true },
        data: JSON.stringify(purchase),
        dataType: "json",
        success: function(response) {
            $(".alert-purchase-success").show();
            clearShoppingBasket();
            renderPurchasesDoneSection();
        }
      });
    });
  }

  function handleLogout() {
    $("#btnLogout").click(function() {
      logout();
      location.replace("galeria-produtos.html");
    });
  }

  function hideAlertSuccess() {
    $(".alert-purchase-success").hide();
  }

  /** function calls() */
  renderTable(getShoppingBasket());
  renderCheckoutSection();
  renderPurchasesDoneSection();
  handlePurchaseDone();
  handleLogout();
  hideAlertSuccess();

}); //end document.ready()
