function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function mostrarFormulario(formId) {
    // Ocultar todos los formularios
    const forms = document.querySelectorAll('form');
    for (let form of forms) {
        form.classList.add('hidden');
    }

    // Mostrar el formulario solicitado
    const form = document.getElementById(formId);
    if (form) {
        form.classList.remove('hidden');
    }
}

function consultarProducto() {
    const productId = document.getElementById('productId').value;
    if (!productId) {
        alert('Por favor, introduce una ID de producto.');
        return;
    }

    // Realizar la solicitud GET a la API del servidor
    fetch(`/api/productos/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se encontró el producto');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar los datos del producto en un SweetAlert
            Swal.fire({
                title: data.nombre,
                text: `Descripción: ${data.descripcion}\nPrecio: ${data.precio}\nStock: ${data.stock}`,
                icon: "success",
            });
        })
        .catch(error => {
            // Mostrar un SweetAlert con el mensaje de error
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
            });
        });
}

function crearProducto() {
    const nombre = document.getElementById('productName').value;
    const descripcion = document.getElementById('productDescription').value;
    const categoria = document.getElementById('productCategory').value;
    const precio = document.getElementById('productPrice').value;
    const stock = document.getElementById('productStock').value;
    const imagen = document.getElementById('productImage').files[0];

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('precio', precio);
    formData.append('stock', stock);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    fetch('/api/productos/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es exitosa, lanzar un error
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            title: "Producto creado",
            text: `El producto ${data.nombre} ha sido creado exitosamente.`,
            icon: "success",
        });
    })
    .catch((error) => {
        // Mostrar un SweetAlert con el mensaje de error
        Swal.fire({
            title: "Error",
            text: error.message || 'Ocurrió un error al crear el producto',
            icon: "error",
        });
    });
}

function obtenerProductoParaActualizar() {
    const productId = document.getElementById('productIdToUpdate').value;
    if (!productId) {
        alert('Por favor, introduce una ID de producto.');
        return;
    }

    // Realizar la solicitud GET a la API del servidor
    fetch(`/api/productos/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se encontró el producto');
            }
            return response.json();
        })
        .then(data => {
            // Llenar los campos del formulario de actualización con los datos del producto
            document.getElementById('updatedProductName').value = data.nombre;
            document.getElementById('updatedProductPrice').value = data.precio;
            document.getElementById('updatedProductStock').value = data.stock;

            // Mostrar el formulario de actualización
            document.getElementById('updateProductForm').classList.remove('hidden');
        })
        .catch(error => {
            // Mostrar un SweetAlert con el mensaje de error
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
            });
        });
}

function actualizarProducto() {
    const productId = document.getElementById('productIdToUpdate').value;
    const nombre = document.getElementById('updatedProductName').value;
    const descripcion = document.getElementById('updatedProductDescription').value;
    const categoria = document.getElementById('updatedProductCategory').value;
    const precio = document.getElementById('updatedProductPrice').value;
    const stock = document.getElementById('updatedProductStock').value;
    const imagen = document.getElementById('updatedProductImage').files[0];

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('precio', precio);
    formData.append('stock', stock);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    fetch(`/api/productos/${productId}/`, {
        method: 'PUT',
        headers: {
            'X-CSRFToken': csrftoken
        },
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es exitosa, lanzar un error
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            title: "Producto actualizado",
            text: `El producto ${data.nombre} ha sido actualizado exitosamente.`,
            icon: "success",
        });
    })
    .catch((error) => {
        // Mostrar un SweetAlert con el mensaje de error
        Swal.fire({
            title: "Error",
            text: error.message || 'Ocurrió un error al actualizar el producto',
            icon: "error",
        });
    });
}

function eliminarProducto() {
    const productId = document.getElementById('productIdToDelete').value;
    if (!productId) {
        alert('Por favor, introduce una ID de producto.');
        return;
    }

    fetch(`/api/productos/${productId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrftoken
        },
    })
    .then(response => {
        if (!response.ok) {
            // Si la respuesta no es exitosa, lanzar un error
            throw new Error('No se pudo eliminar el producto');
        }
        Swal.fire({
            title: "Producto eliminado",
            text: `El producto con ID ${productId} ha sido eliminado exitosamente.`,
            icon: "success",
        });
    })
    .catch((error) => {
        // Mostrar un SweetAlert con el mensaje de error
        Swal.fire({
            title: "Error",
            text: error.message || 'Ocurrió un error al eliminar el producto',
            icon: "error",
        });
    });
}


window.addEventListener('DOMContentLoaded', (event) => {
    const loggedIn = sessionStorage.getItem('loggedIn');
    const isStaff = sessionStorage.getItem('staff');

    if ( loggedIn === 'false' && isStaff === 'false') {
        Swal.fire({
            title: "Acceso denegado",
            text: "No tienes permiso para acceder a esta página.",
            icon: "warning",
            button: "OK",
        })
        .then(() => {
            window.location.href = '/';
        });
    } else if (loggedIn === 'true' && isStaff === 'false'){
        Swal.fire({
            title: "Acceso denegado",
            text: "No tienes permiso para acceder a esta página.",
            icon: "warning",
            button: "OK",
        })
        .then(() => {
            window.location.href = '/';
        });
    }
});
