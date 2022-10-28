from ride_track_app.application.bike.response import BikeResponse
from django.http.response import JsonResponse
from rest_framework import status

from ride_track_app.domain.bike.model import Bike
from ride_track_app.domain.bike.serializer import BikeSerializer
from .response import BikesResponse, BikeResponse

def get_bikes(request):
    bike_query = Bike.objects.filter(user_id=request.oauth_token.sub)
    bike_serializer = BikeSerializer(bike_query, many=True)
    bikes_response = BikesResponse(list(map(lambda bike_data: BikeResponse(
        name = bike_data.get('name'),
        weight = bike_data.get('weight'),
        user_id = bike_data.get('user'),
        id = bike_data.get('id')
    ).__dict__, bike_serializer.data)))
    return JsonResponse(bikes_response.__dict__, status=status.HTTP_200_OK)