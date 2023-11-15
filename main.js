Parse.initialize("noV3fZqC5tLPQxlls7LGis1Qx3zKVKjUEGZ8q2I5", "VOOmw8koyC92ZjJmMd3TRqIQuYmOQhUJ9Z2geQMy");
Parse.serverURL = "https://parseapi.back4app.com/";

async function submitOrder() {
    let Order = Parse.Object.extend("Order");
    let order = new Order();

    try {
        order = await order.save();
        if (order !== null) {
            alert(`Pedido enviado com sucesso! ID do Pedido: ${order.id}`);
        }
    } catch (error) {
        alert(`Erro ao enviar pedido: ${error.message}`);
    }
}

async function viewOrders() {
    let Order = Parse.Object.extend("Order");
    let query = new Parse.Query(Order);

    try {
        let orders = await query.find();

        // Exibir detalhes dos pedidos
        for (let i = 0; i < orders.length; i++) {
            console.log("Pedido ID:", orders[i].id);
            console.log("Madeira:", orders[i].get("wood"));
            console.log("Platinelas:", orders[i].get("jingles"));
            console.log("Tambor:", orders[i].get("head"));
            console.log("Preço:", orders[i].get("price"));
            console.log("Data de Recebimento:", orders[i].get("orderDate"));
            console.log("Data de Previsão de Entrega:", orders[i].get("deliveryDate"));
            console.log("----------------------");
        }
    } catch (error) {
        console.log('Erro ao visualizar pedidos:', error.message);
    }
}

document.getElementById("submitOrderButton").addEventListener("click", async function () {
    submitOrder();
});

document.getElementById("viewOrdersButton").addEventListener("click", async function () {
    viewOrders();
});
