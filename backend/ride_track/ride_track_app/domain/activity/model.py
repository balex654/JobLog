from django.db import models

from ..user.model import User
from ..bike.model import Bike

class Activity(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    moving_time = models.FloatField()
    total_mass = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE)