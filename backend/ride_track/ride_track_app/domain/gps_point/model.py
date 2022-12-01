from django.db import models
from ..activity.model import Activity

class GpsPoint(models.Model):
    date = models.DateTimeField()
    speed = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitude = models.FloatField()
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)