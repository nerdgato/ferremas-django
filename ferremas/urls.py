from django.urls import path
from . import views
from .views import iniciar_pago_mercado_pago, confirmar_pago_mercado_pago


urlpatterns = [
    path('', views.home, name='home'),
    path('productos/', views.productos, name='productos'),
    path('api/productos/<int:pk>/', views.producto_detail_update_delete, name='producto_detail_update_delete'),
    path('api/productos/', views.producto_create),
    path('api/productos/list/', views.productos_list, name='productos_list'),  # Nueva ruta para obtener la lista de productos
    path('crud/', views.crud, name='crud'),
    path('login/', views.login_page, name='login'),
    path('register/', views.register, name='register'),
    path('api/usuarios/', views.usuario_create, name='usuario_create'),
    path('api/login/', views.login_view, name='login_view'),  # Cambiar nombre para evitar conflicto
    path('carrito/', views.carrito, name='carrito'),
    path('iniciar_pago_mercado_pago/', iniciar_pago_mercado_pago, name='iniciar_pago_mercado_pago'),
    path('confirmar_pago_mercado_pago/', confirmar_pago_mercado_pago, name='confirmar_pago_mercado_pago'),
]