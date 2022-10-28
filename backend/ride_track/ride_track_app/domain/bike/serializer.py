from rest_framework import serializers

from . import model

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Bike
        fields = ('id', 'name', 'weight', 'user')