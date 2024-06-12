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
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const direccion = document.getElementById('direccion');
    const region = document.getElementById('region');
    const ciudad = document.getElementById('ciudad');
    const comuna = document.getElementById('comuna');
    const codigoPostal = document.getElementById('codigo_postal');
    const telefono = document.getElementById('telefono');
    const boton = document.querySelector('.boton button');

    function validateName(name) {
        const regex = /^[a-zA-Z\s]+$/;
        return regex.test(name);
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function passwordsMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    function isNotEmpty(field) {
        return field.value.trim() !== '';
    }

    function showError(input, message) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'text-red-500 text-xs italic';
        errorMessage.textContent = message;
        input.parentElement.appendChild(errorMessage);
        input.classList.add('border-red-500');
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.text-red-500');
        errorMessages.forEach(errorMessage => errorMessage.remove());
        const inputs = document.querySelectorAll('.shadow');
        inputs.forEach(input => input.classList.remove('border-red-500'));
    }

    boton.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar el envío del formulario al hacer clic
        clearErrors();

        let valid = true;

        if (!validateName(nombre.value)) {
            showError(nombre, 'Nombre inválido. Solo se permiten letras y espacios.');
            valid = false;
        }

        if (!validateName(apellido.value)) {
            showError(apellido, 'Apellido inválido. Solo se permiten letras y espacios.');
            valid = false;
        }

        if (!validateEmail(email.value)) {
            showError(email, 'Correo electrónico inválido.');
            valid = false;
        }

        if (!passwordsMatch(password.value, confirmPassword.value)) {
            showError(confirmPassword, 'Las contraseñas no coinciden.');
            valid = false;
        }

        if (!isNotEmpty(direccion)) {
            showError(direccion, 'La dirección no puede estar vacía.');
            valid = false;
        }

        if (!isNotEmpty(region)) {
            showError(region, 'La región no puede estar vacía.');
            valid = false;
        }

        if (!isNotEmpty(ciudad)) {
            showError(ciudad, 'La ciudad no puede estar vacía.');
            valid = false;
        }

        if (!isNotEmpty(comuna)) {
            showError(comuna, 'La comuna no puede estar vacía.');
            valid = false;
        }

        if (!isNotEmpty(codigoPostal)) {
            showError(codigoPostal, 'El código postal no puede estar vacío.');
            valid = false;
        }

        if (!isNotEmpty(telefono)) {
            showError(telefono, 'El teléfono no puede estar vacío.');
            valid = false;
        }

        if (valid) {
            // Crear un objeto FormData con los datos del formulario
            const formData = new FormData(form);

            // Hacer una solicitud POST al servidor
            fetch('/api/usuarios/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        if (data.email) {
                            throw new Error(data.email[0]);
                        } else {
                            throw new Error('Error al registrar el usuario');
                        }
                    });
                }
                swal("¡Buen trabajo!", "Te has registrado exitosamente", "success")
                .then(() => {
                    window.location.href = '/';
                });
            })
            .catch(error => {
                swal("Error", error.message, "error");
            });
        }
    });
});
