from unittest.util import _MAX_LENGTH
from django.db import models

class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=200)
    id = models.CharField(max_length=200, primary_key=True)
    weight = models.FloatField(default=80.0)