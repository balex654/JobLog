from rest_framework import serializers

from . import model

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = model.Activity
        fields = ('id', 'name', 'start_date', 'end_date', 'moving_time', 'user', 'bike', 'total_mass')