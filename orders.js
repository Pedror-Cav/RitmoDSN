Parse.initialize("noV3fZqC5tLPQxlls7LGis1Qx3zKVKjUEGZ8q2I5", "VOOmw8koyC92ZjJmMd3TRqIQuYmOQhUJ9Z2geQMy");
Parse.serverURL = "https://parseapi.back4app.com/";

function formatDate(dateString) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-BR');
    }
    return 'Data inválida';
}

function displayOrders(orders) {
    const ordersList = document.getElementById("ordersList");

    orders.forEach(order => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Pedido ID:</strong> ${order.id} <br>
            <strong>Madeira:</strong> ${order.get("wood")} <br>
            <strong>Platinelas:</strong> ${order.get("jingles")} <br>
            <strong>Tambor:</strong> ${order.get("head")} <br>
            <strong>Preço:</strong> ${order.get("price")} <br>
            <strong>Data de Recebimento:</strong> ${formatDate(order.get("orderDate"))} <br>
            <strong>Data de Previsão de Entrega:</strong> ${formatDate(order.get("deliveryDate"))} <br>
            <button class="deleteButton" data-order-id="${order.id}">Deletar</button>
            <button class="updateButton" data-order-id="${order.id}">Editar Pedido</button>
            <hr>
        `;

        listItem.querySelector('.deleteButton').addEventListener('click', () => deleteOrder(order.id));
        listItem.querySelector('.updateButton').addEventListener('click', () => editOrder(order.id));
        ordersList.appendChild(listItem);
    });
}

async function getOrders() {
    const Order = Parse.Object.extend("Order");
    const query = new Parse.Query(Order);

    try {
        const orders = await query.find();
        displayOrders(orders);
    } catch (error) {
        console.log('Erro ao buscar pedidos:', error.message);
    }
}

async function deleteOrder(orderId) {
    const confirmed = confirm("Tem certeza que deseja excluir este pedido?");
    if (!confirmed) return;

    const Order = Parse.Object.extend("Order");
    const query = new Parse.Query(Order);

    try {
        const order = await query.get(orderId);
        await order.destroy();
        alert(`Pedido ID: ${orderId} foi deletado com sucesso!`);
        getOrders(); // Atualiza a lista após deletar
    } catch (error) {
        console.log('Erro ao deletar pedido:', error.message);
    }
}

function editOrder(orderId) {
    const Order = Parse.Object.extend("Order");
    const query = new Parse.Query(Order);

    query.get(orderId)
        .then(order => {
            const woodOptions = ['Imbuia', 'Cedro'];
            const headOptions = ['Couro', 'Nylon'];
            const jinglesOptions = ['5', '6'];

            let updatedWood = prompt(`Editar tipo de madeira (${woodOptions.join(', ')}):`, order.get("wood"));
            let updatedHead = prompt(`Editar material do tambor (${headOptions.join(', ')}):`, order.get("head"));
            let updatedJingles = prompt(`Editar quantidade de platinelas (${jinglesOptions.join(', ')}):`, order.get("jingles"));
            let updatedPrice = parseFloat(prompt("Editar preço:", order.get("price")));
            let updatedOrderDateInput = prompt("Editar data de recebimento (Formato: dd/mm/aaaa):", formatDate(order.get("orderDate")));
            let updatedDeliveryDateInput = prompt("Editar data de previsão de entrega (Formato: dd/mm/aaaa):", formatDate(order.get("deliveryDate")));

            // Validando entradas e formatando datas
            updatedWood = woodOptions.includes(updatedWood) ? updatedWood : order.get("wood");
            updatedHead = headOptions.includes(updatedHead) ? updatedHead : order.get("head");
            updatedJingles = jinglesOptions.includes(updatedJingles) ? updatedJingles : order.get("jingles");

            const updatedOrderDateArray = updatedOrderDateInput.split('/');
            const updatedDeliveryDateArray = updatedDeliveryDateInput.split('/');

            const updatedOrderDate = new Date(`${updatedOrderDateArray[2]}-${updatedOrderDateArray[1]}-${updatedOrderDateArray[0]}`);
            const updatedDeliveryDate = new Date(`${updatedDeliveryDateArray[2]}-${updatedDeliveryDateArray[1]}-${updatedDeliveryDateArray[0]}`);

            if (isNaN(updatedOrderDate.getTime()) || isNaN(updatedDeliveryDate.getTime())) {
                console.log('Datas inválidas');
                return;
            }

            const updatedData = {
                "wood": updatedWood,
                "head": updatedHead,
                "jingles": updatedJingles,
                "price": updatedPrice,
                "orderDate": updatedOrderDate,
                "deliveryDate": updatedDeliveryDate
            };

            updateOrder(orderId, updatedData);
        })
        .catch(error => {
            console.log('Erro ao obter pedido para edição:', error.message);
        });
}

async function updateOrder(orderId, updatedData) {
    const Order = Parse.Object.extend("Order");
    const query = new Parse.Query(Order);

    try {
        const order = await query.get(orderId);

        Object.keys(updatedData).forEach(key => {
            order.set(key, updatedData[key]);
        });

        await order.save();
        alert(`Pedido ID: ${orderId} foi atualizado com sucesso!`);
        location.reload(); // Atualiza a página após a atualização do pedido
    } catch (error) {
        console.log('Erro ao atualizar pedido:', error.message);
    }
}



document.addEventListener('DOMContentLoaded', getOrders);