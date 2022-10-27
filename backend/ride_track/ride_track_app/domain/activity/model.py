from django.db import models

class Activity(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    moving_time = models.FloatField()
    user = models.ForeignKey('User', on_delete=models.CASCADE)