from rest_framework.decorators import api_view
from authlib.integrations.django_oauth2 import ResourceProtector

from ride_track_app.application.bike import add_bike, get_bikes, get_bike_by_id, edit_bike
from ride_track_app.auth import validator

require_auth = ResourceProtector()
validator = validator.Auth0JWTBearerTokenValidator(
    "dev-2uer6jn7.us.auth0.com",
    "https://ride-track-backend-gol2gz2rwq-uc.a.run.app"
)
require_auth.register_token_validator(validator)

@api_view(['POST', 'GET'])
@require_auth()
def bike(request):
    if request.method == 'POST':
        return add_bike.add(request)
    if request.method == 'GET':
        return get_bikes.get_bikes(request)

@api_view(['GET', 'PUT'])
@require_auth()
def bike_id(request, id):
    if request.method == 'GET':
        return get_bike_by_id.get_bike_by_id(request, id)
    if request.method == 'PUT':
        return edit_bike.edit(request, id)