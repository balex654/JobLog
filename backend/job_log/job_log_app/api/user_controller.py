from rest_framework.decorators import api_view

from job_log_app.application.user import add_user, get_users

@api_view(['POST', 'GET'])
def user(request):
    if request.method == 'POST':
        return add_user.add(request)
    elif request.method == 'GET':
        return get_users.get()