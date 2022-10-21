from django.http.response import JsonResponse
from rest_framework import status

from ride_track_app.domain.user.model import User
from ride_track_app.domain.user.serializer import UserSerializer
from .response import UserResponse

def get_user_by_id(id):
    user_query = User.objects.filter(id=id)
    if user_query.count() == 0:
        error = {
            'error': 'user not found'
        }
        return JsonResponse(error, status=status.HTTP_404_NOT_FOUND)

    user_serializer = UserSerializer(user_query[0])
    user_response = UserResponse(
            user_serializer.data.get('first_name'),
            user_serializer.data.get('last_name'),
            user_serializer.data.get('email'),
            user_serializer.data.get('id'))
    return JsonResponse(user_response.__dict__, status=status.HTTP_200_OK)

