from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from job_log_app.application.user.form import UserForm
from job_log_app.domain.user.serializer import UserSerializer
from .response import UserResponse

def add(request):
    user_data = JSONParser().parse(request)
    form = UserForm(data=user_data)
    if not form.is_valid():
        return JsonResponse(form.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(form.data.get('password'))
    except ValidationError as error:
        error_dict = { 'password': [] }
        for m in error.messages:
            error_dict['password'].append(m)
        return JsonResponse(error_dict, status=status.HTTP_400_BAD_REQUEST)
    
    user_model_data = {
        'first_name': form.data.get('first_name'),
        'last_name': form.data.get('last_name'),
        'email': form.data.get('email'),
        'password': make_password(form.data.get('password'))
    }
    user_serializer = UserSerializer(data=user_model_data)
    if user_serializer.is_valid():
        user_serializer.save()
        user_response = UserResponse(
            user_serializer.data.get('first_name'),
            user_serializer.data.get('last_name'),
            user_serializer.data.get('email'),
            user_serializer.data.get('id'))
        return JsonResponse(user_response.__dict__, status=status.HTTP_201_CREATED, safe=False)

    return JsonResponse(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)