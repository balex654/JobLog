from django.db import models

class Bike(models.Model):
    name = models.CharField(max_length=100)
    weight = models.FloatField()
    user = models.ForeignKey('User', on_delete=models.CASCADE)