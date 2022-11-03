from rest_framework import serializers

from . import model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = model.User
        fields = ('id', 'first_name', 'last_name', 'email', 'weight')