from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as auth_login
from .models import Producto, Usuario
from .serializers import ProductoSerializer, UsuarioSerializer
from django.core.exceptions import ObjectDoesNotExist
from transbank.webpay.webpay_plus.transaction import Transaction, WebpayOptions
from transbank.common.integration_type import IntegrationType
from django.conf import settings

import random

import json

@csrf_exempt
def obtener_estado_transaccion(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        token = data.get('token')

        if not token:
            return JsonResponse({'error': 'Token no proporcionado'}, status=400)

        # Configura las opciones de Webpay
        webpay_options = WebpayOptions(
            commerce_code=settings.COMMERCE_CODE,
            api_key=settings.WEBPAY_API_KEY,
            integration_type=IntegrationType.TEST
        )

        # Llama a la API de Transbank para obtener el estado de la transacción
        transaction = Transaction(webpay_options)
        response = transaction.get_status(token)

        return JsonResponse(response, safe=False)


@csrf_exempt
def iniciar_pago(request):
    if request.method == 'POST':
        # Obtén el monto total de la compra del request
        data = json.loads(request.body)
        total = data.get('total')

        buy_order = str(random.randint(100000, 999999))
        session_id = 'session_id'
        return_url = request.build_absolute_uri('/confirmar_pago/')
        commerce_code = settings.COMMERCE_CODE
        api_key = settings.WEBPAY_API_KEY

        print(f"buy_order: {buy_order}")
        print(f"session_id: {session_id}")
        print(f"total: {total}")
        print(f"return_url: {return_url}")
        print(f"commerce_code: {commerce_code}")

        # Configura las opciones de Webpay
        webpay_options = WebpayOptions(
            commerce_code=commerce_code,
            api_key=api_key
        )

        # Llama a la API de Transbank para iniciar la transacción
        transaction = Transaction(webpay_options)
        response = transaction.create(
            buy_order=buy_order,
            session_id=session_id,
            amount=total,
            return_url=return_url
        )

        return JsonResponse(response, safe=False)



@csrf_exempt
def confirmar_pago(request):
    token = request.POST.get('token_ws')
    response = Transaction.commit(token)

    if response['response_code'] == 0:
        return render(request, 'pago_exitoso.html', {'response': response})
    else:
        return render(request, 'pago_fallido.html', {'response': response})

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

        return JsonResponse({'message': 'Inicio de sesión exitoso', 'staff': user.staff}, status=200)


def home(request):
    context = {'title': 'Ferremas'}
    return render(request, 'ferremas/home.html', context)


def productos(request):
    productos = Producto.objects.all()
    context = {'title': 'Productos', 'productos': productos}
    return render(request, 'ferremas/productos.html', context)

def carrito(request):
    context = {'title': 'Carrito'}
    return render(request, 'ferremas/carrito.html', context)


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
