from rest_framework.decorators import api_view
from authlib.integrations.django_oauth2 import ResourceProtector

from ride_track_app.auth import validator
from ..application.gps_point import get_gps_points

require_auth = ResourceProtector()
validator = validator.Auth0JWTBearerTokenValidator(
    "dev-2uer6jn7.us.auth0.com",
    "https://ride-track-backend-gol2gz2rwq-uc.a.run.app"
)
require_auth.register_token_validator(validator)

@api_view(['GET'])
@require_auth()
def gps_points_by_activity(request, activity_id):
    return get_gps_points.get_gps_points(request, activity_id)