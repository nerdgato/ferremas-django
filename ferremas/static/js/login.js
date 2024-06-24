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
        event.preventDefault();

        const data = {
            email: form.elements['email'].value,
            password: form.elements['password'].value
        };

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
                return response.json().then(data => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Buen trabajo!',
                        text: 'Has iniciado sesión exitosamente',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        sessionStorage.setItem('loggedIn', true);
                        sessionStorage.setItem('staff', data.staff);
                        window.location.href = '/';
                    });
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        });
    });
});