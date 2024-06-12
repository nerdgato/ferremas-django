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

document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.querySelector('form');
    const boton = document.querySelector('button');

    boton.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar el envío del formulario al hacer clic

        // Crear un objeto con los datos del formulario
        const data = {
            email: form.elements['email'].value,
            password: form.elements['password'].value
        };

        // Hacer una solicitud POST al servidor
        fetch('/api/login/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    if (data.non_field_errors) {
                        throw new Error(data.non_field_errors[0]);
                    } else {
                        throw new Error('Error al iniciar sesión');
                    }
                });
            } else {
                swal("¡Buen trabajo!", "Has iniciado sesión exitosamente", "success")
                .then(() => {
                    window.location.href = '/';
                });
            }
        })
        .catch(error => {
            swal("Error", error.message, "error");
        });
    });
});