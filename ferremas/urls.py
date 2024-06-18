from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('productos/', views.productos, name='productos'),
    path('api/productos/<int:pk>/', views.producto_detail_update_delete, name='producto_detail_update_delete'),
    path('api/productos/', views.producto_create),
    path('crud/', views.crud, name='crud'),
    path('login/', views.login_page, name='login'),
    path('register/', views.register, name='register'),
    path('api/usuarios/', views.usuario_create, name='usuario_create'),
    path('api/login/', views.login_view, name='login_view'),  # Cambiar nombre para evitar conflicto
    path('carrito/', views.carrito, name='carrito'),
]
