from rest_framework.decorators import api_view
from authlib.integrations.django_oauth2 import ResourceProtector

from ride_track_app.application.activity import add_activity, get_activities
from ride_track_app.auth import validator

require_auth = ResourceProtector()
validator = validator.Auth0JWTBearerTokenValidator(
    "dev-2uer6jn7.us.auth0.com",
    "https://ride-track-backend-gol2gz2rwq-uc.a.run.app"
)
require_auth.register_token_validator(validator)

@api_view(['POST', 'GET'])
@require_auth()
def activity(request):
    if request.method == 'POST':
        return add_activity.add(request)
    elif request.method == 'GET':
        return get_activities.get_activities(request)