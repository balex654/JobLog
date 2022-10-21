from rest_framework.decorators import api_view
from authlib.integrations.django_oauth2 import ResourceProtector
from django.http import JsonResponse

from ride_track_app.application.user import add_user, get_user_by_id
from ride_track_app.auth import validator

require_auth = ResourceProtector()
validator = validator.Auth0JWTBearerTokenValidator(
    "dev-2uer6jn7.us.auth0.com",
    "https://ride-track-backend-gol2gz2rwq-uc.a.run.app"
)
require_auth.register_token_validator(validator)

@api_view(['POST', 'GET'])
@require_auth()
def user(request):
    if request.method == 'POST':
        return add_user.add(request)
    elif request.method == 'GET':
        token = request.oauth_token
        return get_user_by_id.get_user_by_id(token['sub'])