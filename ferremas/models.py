from django.db import models

# Create your models here.


class Producto(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    imagen = models.ImageField(upload_to='productos', null=True)


class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField()
    password = models.CharField(max_length=50)
    direccion = models.CharField(max_length=100)
    region = models.CharField(max_length=50)
    ciudad = models.CharField(max_length=50)
    comuna = models.CharField(max_length=50)
    codigo_postal = models.CharField(max_length=10)
    telefono = models.CharField(max_length=10)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    staff = models.BooleanField(default=False)
