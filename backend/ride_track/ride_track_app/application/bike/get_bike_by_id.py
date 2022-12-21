from django.http.response import JsonResponse
from rest_framework import status

from ride_track_app.application.bike.response import BikeResponse
from ride_track_app.domain.bike.model import Bike
from ride_track_app.domain.bike.serializer import BikeSerializer

def get_bike_by_id(request, id):
    bike_query = Bike.objects.filter(
        user_id=request.oauth_token.sub,
        id=id,
        is_deleted=False)
    if bike_query.count() == 0:
        error = {
            'error': 'bike not found'
        }
        return JsonResponse(error, status=status.HTTP_404_NOT_FOUND)
    
    bike_serializer = BikeSerializer(bike_query[0])
    bike_response = BikeResponse(
        name=bike_serializer.data.get('name'),
        weight=bike_serializer.data.get('weight'),
        user_id=bike_serializer.data.get('user'),
        id=bike_serializer.data.get('id')
    )
    return JsonResponse(bike_response.__dict__, status=status.HTTP_200_OK)