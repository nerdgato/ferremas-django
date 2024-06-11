from django.shortcuts import render
from .models import Producto

# Create your views here.


def home(request):
    context = {'title': 'Ferremas'}
    return render(request, 'ferremas/home.html', context)


def productos(request):
    productos = Producto.objects.all()
    context = {'title': 'Productos', 'productos': productos}
    return render(request, 'ferremas/productos.html', context)
