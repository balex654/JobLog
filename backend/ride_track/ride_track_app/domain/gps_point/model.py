from django.db import models

class GpsPoint(models.Model):
    date = models.DateTimeField()
    speed = models.FloatField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    altitude = models.FloatField()
    activity = models.ForeignKey('Activity', on_delete=models.CASCADE)