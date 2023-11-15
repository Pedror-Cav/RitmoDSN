// main.js

Parse.initialize("noV3fZqC5tLPQxlls7LGis1Qx3zKVKjUEGZ8q2I5", "VOOmw8koyC92ZjJmMd3TRqIQuYmOQhUJ9Z2geQMy");
Parse.serverURL = "https://parseapi.back4app.com/";

document.getElementById("submitOrderButton").addEventListener("click", function () {
    const Order = Parse.Object.extend("Order");
    const order = new Order();

    order.set("wood", document.getElementById("woodType").value);
    order.set("jingles", parseInt(document.getElementById("jingles").value));
    order.set("head", document.getElementById("headMaterial").value);
    order.set("price", parseFloat(document.getElementById("price").value));
    order.set("orderDate", new Date(document.getElementById("orderDate").value));
    order.set("deliveryDate", new Date(document.getElementById("deliveryDate").value));

    order.save().then(() => {
        alert("Pedido enviado com sucesso!");
    }).catch((error) => {
        alert(`Erro ao enviar pedido: ${error.message}`);
    });
});

document.getElementById("viewOrdersButton").addEventListener("click", function () {
    window.location.href = "order.html";
});
