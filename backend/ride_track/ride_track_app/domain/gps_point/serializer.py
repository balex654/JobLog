from rest_framework import serializers

from . import model

class GpsPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.GpsPoint
        fields = ('id', 'date', 'speed', 'latitude', 'longitude', 'altitude', 'activity')