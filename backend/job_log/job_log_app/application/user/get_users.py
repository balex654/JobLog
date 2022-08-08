from django.http.response import JsonResponse

from job_log_app.domain.user.serializer import UserSerializer
from job_log_app.domain.user.model import User

def get():
    users = User.objects.all()
    user_serializer = UserSerializer(users, many=True)
    return JsonResponse(user_serializer.data, safe=False)