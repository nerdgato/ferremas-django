document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        var productId = this.getAttribute('data-id');
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado al carrito',
            showConfirmButton: false,
            timer: 1500
        });
    });
});