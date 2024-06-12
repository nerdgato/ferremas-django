from rest_framework import serializers
from .models import Producto, Usuario


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'categoria', 'precio', 'stock', 'imagen']
        extra_kwargs = {'imagen': {'required': False}}


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'apellido', 'email', 'password', 'direccion', 'region', 'ciudad', 'comuna', 'codigo_postal', 'telefono', 'fecha_registro', 'staff']

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Correo ya existente en el sistema")
        return value
