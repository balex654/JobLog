from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from ride_track_app.application.user.form import UserForm
from ride_track_app.domain.user.serializer import UserSerializer
from .response import UserResponse

def add(request):
    user_data = JSONParser().parse(request)
    form = UserForm(data=user_data)
    if not form.is_valid():
        return JsonResponse(form.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user_model_data = {
        'first_name': form.data.get('first_name'),
        'last_name': form.data.get('last_name'),
        'email': form.data.get('email'),
        'id': form.data.get('id'),
        'weight': form.data.get('weight')
    }
    user_serializer = UserSerializer(data=user_model_data)
    if user_serializer.is_valid():
        user_serializer.save()
        user_response = UserResponse(
            user_serializer.data.get('first_name'),
            user_serializer.data.get('last_name'),
            user_serializer.data.get('email'),
            user_serializer.data.get('id'),
            user_serializer.data.get('weight'))
        return JsonResponse(user_response.__dict__, status=status.HTTP_201_CREATED, safe=False)

    return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)