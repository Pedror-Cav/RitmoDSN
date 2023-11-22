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

            const formContainer = document.createElement('div');

            const woodLabel = document.createElement('label');
            woodLabel.textContent = 'Editar tipo de madeira:';
            const woodSelect = document.createElement('select');
            woodOptions.forEach(option => {
                const woodOption = document.createElement('option');
                woodOption.value = option.toLowerCase();
                woodOption.textContent = option;
                woodSelect.appendChild(woodOption);
            });
            woodSelect.value = order.get("wood");
            woodLabel.appendChild(woodSelect);

            const headLabel = document.createElement('label');
            headLabel.textContent = 'Editar material do tambor:';
            const headSelect = document.createElement('select');
            headOptions.forEach(option => {
                const headOption = document.createElement('option');
                headOption.value = option.toLowerCase();
                headOption.textContent = option;
                headSelect.appendChild(headOption);
            });
            headSelect.value = order.get("head");
            headLabel.appendChild(headSelect);

            const jinglesLabel = document.createElement('label');
            jinglesLabel.textContent = 'Editar quantidade de platinelas:';
            const jinglesSelect = document.createElement('select');
            jinglesOptions.forEach(option => {
                const jinglesOption = document.createElement('option');
                jinglesOption.value = option;
                jinglesOption.textContent = option;
                jinglesSelect.appendChild(jinglesOption);
            });
            jinglesSelect.value = order.get("jingles").toString();
            jinglesLabel.appendChild(jinglesSelect);

            const priceLabel = document.createElement('label');
            priceLabel.textContent = 'Editar preço:';
            const priceInput = document.createElement('input');
            priceInput.type = 'text';
            priceInput.value = order.get("price").toString();
            priceLabel.appendChild(priceInput);

            const orderDateLabel = document.createElement('label');
            orderDateLabel.textContent = 'Editar data de recebimento (Formato: dd/mm/aaaa):';
            const orderDateInput = document.createElement('input');
            orderDateInput.type = 'date';
            orderDateInput.value = formatDate(order.get("orderDate"));
            orderDateLabel.appendChild(orderDateInput);

            const deliveryDateLabel = document.createElement('label');
            deliveryDateLabel.textContent = 'Editar data de previsão de entrega (Formato: dd/mm/aaaa):';
            const deliveryDateInput = document.createElement('input');
            deliveryDateInput.type = 'date';
            deliveryDateInput.value = formatDate(order.get("deliveryDate"));
            deliveryDateLabel.appendChild(deliveryDateInput);

            formContainer.appendChild(woodLabel);
            formContainer.appendChild(headLabel);
            formContainer.appendChild(jinglesLabel);
            formContainer.appendChild(priceLabel);
            formContainer.appendChild(orderDateLabel);
            formContainer.appendChild(deliveryDateLabel);

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Salvar Edição';
            saveButton.addEventListener('click', () => {
                const updatedData = {
                    "wood": woodSelect.value,
                    "head": headSelect.value,
                    "jingles": parseInt(jinglesSelect.value),
                    "price": parseFloat(priceInput.value),
                    "orderDate": new Date(orderDateInput.value),
                    "deliveryDate": new Date(deliveryDateInput.value)
                };
                updateOrder(orderId, updatedData);
            });

            formContainer.appendChild(saveButton);

            const editForm = document.createElement('form');
            editForm.appendChild(formContainer);

            const ordersList = document.getElementById("ordersList");
            ordersList.innerHTML = '';
            ordersList.appendChild(editForm);
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

        // Atualiza os campos do pedido com os novos dados
        order.set("wood", updatedData.wood);
        order.set("jingles", updatedData.jingles);
        order.set("head", updatedData.head);
        order.set("price", updatedData.price);
        order.set("orderDate", updatedData.orderDate);
        order.set("deliveryDate", updatedData.deliveryDate);

        // Salva as alterações no pedido
        await order.save();
        alert(`Pedido ID: ${orderId} foi atualizado com sucesso!`);
        location.reload(); // Atualiza a página após a atualização do pedido
    } catch (error) {
        console.log('Erro ao atualizar pedido:', error.message);
    }
}



document.addEventListener('DOMContentLoaded', getOrders);