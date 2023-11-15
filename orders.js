Parse.initialize("noV3fZqC5tLPQxlls7LGis1Qx3zKVKjUEGZ8q2I5", "VOOmw8koyC92ZjJmMd3TRqIQuYmOQhUJ9Z2geQMy");
Parse.serverURL = "https://parseapi.back4app.com/";

async function getOrders() {
    let Order = Parse.Object.extend("Order");
    let query = new Parse.Query(Order);

    try {
        let orders = await query.find();
        displayOrders(orders);
    } catch (error) {
        console.log('Erro ao buscar pedidos:', error.message);
    }
}

function displayOrders(orders) {
    let ordersList = document.getElementById("ordersList");
    ordersList.innerHTML = '';

    orders.forEach(order => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `
            Pedido ID: ${order.id} | 
            Madeira: ${order.get("wood")} | 
            Platinelas: ${order.get("jingles")} | 
            Tambor: ${order.get("head")} | 
            Preço: ${order.get("price")} | 
            Data de Recebimento: ${order.get("orderDate")} | 
            Data de Previsão de Entrega: ${order.get("deliveryDate")}
        `;

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.addEventListener('click', () => deleteOrder(order));

        listItem.appendChild(deleteButton);
        ordersList.appendChild(listItem);
    });
}

async function deleteOrder(order) {
    try {
        await order.destroy();
        getOrders();
    } catch (error) {
        console.log('Erro ao deletar pedido:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', getOrders);
