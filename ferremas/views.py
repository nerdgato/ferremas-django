from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as auth_login
from .models import Producto, Usuario
from .serializers import ProductoSerializer, UsuarioSerializer
from django.core.exceptions import ObjectDoesNotExist
import json

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Faltan campos requeridos'}, status=400)

        try:
            user = Usuario.objects.get(email=email)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=400)

        if user.password != password:
            return JsonResponse({'error': 'Contraseña incorrecta'}, status=400)

        # Aquí va tu lógica para manejar un inicio de sesión exitoso
        return JsonResponse({'message': 'Inicio de sesión exitoso'}, status=200)

def home(request):
    context = {'title': 'Ferremas'}
    return render(request, 'ferremas/home.html', context)

def productos(request):
    productos = Producto.objects.all()
    context = {'title': 'Productos', 'productos': productos}
    return render(request, 'ferremas/productos.html', context)

@api_view(['GET', 'PUT', 'DELETE'])
def producto_detail_update_delete(request, pk):
    producto = get_object_or_404(Producto, pk=pk)

    if request.method == 'GET':
        serializer = ProductoSerializer(producto)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProductoSerializer(producto, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        producto.delete()
        return Response(status=204)

@api_view(['POST'])
def producto_create(request):
    serializer = ProductoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

def crud(request):
    context = {'title': 'crud'}
    return render(request, 'ferremas/crud.html', context)

def login_page(request):
    context = {'title': 'Login'}
    return render(request, 'ferremas/login.html', context)

def register(request):
    context = {'title': 'Registro'}
    return render(request, 'ferremas/register.html', context)

@csrf_exempt
def usuario_create(request):
    if request.method == 'POST':
        data = request.POST
        serializer = UsuarioSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        print(serializer.errors)  # Imprimir los errores
        return JsonResponse(serializer.errors, status=400)
