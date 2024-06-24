if (sessionStorage.getItem('loggedIn') === null) {
    sessionStorage.setItem('loggedIn', 'false');
}

if (sessionStorage.getItem('staff') === null) {
    sessionStorage.setItem('staff', 'false');
}

document.getElementById('cart-link').addEventListener('click', function(event) {
    var cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    if (Object.keys(cart).length === 0) {
        event.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'No hay productos en el carrito',
            text: 'Agrega productos al carrito para continuar',
            showConfirmButton: true,
        });
    }
});

document.querySelectorAll('.add-to-cart').forEach(function(button) {
    button.addEventListener('click', function() {
        var productId = this.getAttribute('data-id');
        var cart = JSON.parse(sessionStorage.getItem('cart')) || {};
        cart[productId] = (cart[productId] || 0) + 1;
        sessionStorage.setItem('cart', JSON.stringify(cart));
    });
});

if (document.getElementById('cart-table')) {
    var cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    var cartTable = document.getElementById('cart-table');
    var total = 0;

    function updateTotalRow() {
        var totalRow = document.getElementById('total-row');
        if (!totalRow) {
            totalRow = cartTable.insertRow();
            totalRow.id = 'total-row';
            totalRow.className = 'border-t border-gray-200';

            var emptyCell = totalRow.insertCell();
            emptyCell.className = 'py-4 px-6 align-middle';
            emptyCell.colSpan = 1;

            var labelCell = totalRow.insertCell();
            labelCell.textContent = 'Total:';
            labelCell.className = 'py-4 px-6 align-middle font-bold';

            var totalCell = totalRow.insertCell();
            totalCell.id = 'total-cell';
            totalCell.className = 'py-4 px-6 align-middle font-bold';


            var payCell = totalRow.insertCell();
            payCell.className = 'py-4 px-6 align-middle';
            var payButton = document.createElement('button');
            payButton.textContent = 'Pagar';
            payButton.className = 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
            payButton.id = 'pay-button';  // Añadir ID para el botón de pago
            payCell.appendChild(payButton);
        }
        document.getElementById('total-cell').textContent = "$" + total + " CLP";
    }

    // Función para manejar la transacción de pago
    function handlePayment(total) {
        fetch('/iniciar_pago/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ total: total }),
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = data.url;
        })
        .catch(error => console.error('Error:', error));
    }

    // Insertar la fila del total después de cargar todos los productos
    var promises = [];
    for (var productId in cart) {
        promises.push(
            fetch('/api/productos/' + productId)
                .then(response => response.json())
                .then(producto => {
                    var row = cartTable.insertRow(cartTable.rows.length - 1);
                    row.className = 'border-t border-gray-200';

                    var imgCell = row.insertCell();
                    imgCell.className = 'py-4 px-6 align-middle';
                    var img = document.createElement('img');
                    img.src = producto.imagen;
                    img.className = 'w-20 h-20 object-contain';
                    imgCell.appendChild(img);

                    var nameCell = row.insertCell();
                    nameCell.textContent = producto.nombre;
                    nameCell.className = 'py-4 px-6 align-middle';

                    var priceCell = row.insertCell();
                    priceCell.textContent = "$" + producto.precio * cart[productId] + " CLP";
                    priceCell.className = 'py-4 px-6 align-middle';

                    total += producto.precio * cart[productId]; // Acumular el total

                    var quantityCell = row.insertCell();
                    quantityCell.className = 'py-4 px-6 flex justify-around items-center align-middle custom-spacing';

                    var decreaseButton = document.createElement('button');
                    decreaseButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs';
                    decreaseButton.innerHTML = '<i class="fas fa-minus"></i>';
                    decreaseButton.addEventListener('click', function() {
                        if (cart[productId] > 1) {
                            cart[productId]--;
                            sessionStorage.setItem('cart', JSON.stringify(cart));
                            quantityDiv.textContent = cart[productId];
                            var oldTotal = total;
                            total -= producto.precio; // Restar solo el precio de un producto al total
                            priceCell.textContent = "$" + producto.precio * cart[productId] + " CLP";
                            updateTotalRow(); // Actualizar el total después de decrementar
                        }
                    });

                    var quantityDiv = document.createElement('div');
                    quantityDiv.textContent = cart[productId];
                    quantityDiv.className = 'text-center';

                    var increaseButton = document.createElement('button');
                    increaseButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs';
                    increaseButton.innerHTML = '<i class="fas fa-plus"></i>';
                    increaseButton.addEventListener('click', function() {
                        cart[productId]++;
                        sessionStorage.setItem('cart', JSON.stringify(cart));
                        quantityDiv.textContent = cart[productId];
                        var oldTotal = total;
                        total += producto.precio * cart[productId] - producto.precio;
                        priceCell.textContent = "$" + producto.precio * cart[productId] + " CLP";
                        updateTotalRow();
                    });

                    quantityCell.appendChild(decreaseButton);
                    quantityCell.appendChild(quantityDiv);
                    quantityCell.appendChild(increaseButton);

                    var deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded';
                    deleteButton.addEventListener('click', function() {
                        total -= producto.precio * cart[productId]; // Actualizar el total
                        delete cart[productId];
                        sessionStorage.setItem('cart', JSON.stringify(cart));
                        cartTable.deleteRow(row.rowIndex);
                        updateTotalRow(); // Actualizar la fila del total
                    });

                    var deleteCell = row.insertCell();
                    deleteCell.className = 'py-4 px-6 align-middle';
                    deleteCell.appendChild(deleteButton);
                })
        );
    }

    Promise.all(promises).then(() => {
        updateTotalRow(); // Llamar a la función para inicializar la fila del total

        // Añadir el evento de click al botón de pago
        document.getElementById('pay-button').addEventListener('click', function() {
            handlePayment(total); // Iniciar la transacción de pago
        });
    });
}
