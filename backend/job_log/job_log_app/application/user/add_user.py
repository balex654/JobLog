from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.contrib.auth.hashers import make_password

from job_log_app.domain.user.serializer import UserSerializer
from .response import UserResponse

def add(request):
    user_data = JSONParser().parse(request)
    if 'password' in user_data:
        user_data['password'] = make_password(user_data['password'])
    else:
        return JsonResponse({'error' : 'No password in request body'}, status=status.HTTP_400_BAD_REQUEST)
    
    user_serializer = UserSerializer(data=user_data)
    if user_serializer.is_valid():
        user_serializer.save()
        user_response = UserResponse(
            user_serializer.data.get('first_name'),
            user_serializer.data.get('last_name'),
            user_serializer.data.get('email'),
            user_serializer.data.get('id'))
        return JsonResponse(user_response.__dict__, status=status.HTTP_201_CREATED, safe=False)

    return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)