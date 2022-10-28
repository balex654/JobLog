from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from ride_track_app.application.bike.form import BikeForm
from ride_track_app.application.bike.response import BikeResponse
from ride_track_app.domain.bike.serializer import BikeSerializer

def add(request):
    form = BikeForm(data=JSONParser().parse(request))
    if not form.is_valid():
        return JsonResponse(form.errors, status=status.HTTP_400_BAD_REQUEST)

    bike_model_data = {
        'name': form.data.get('name'),
        'weight': form.data.get('weight'),
        'user': request.oauth_token.sub
    }
    bike_serializer = BikeSerializer(data=bike_model_data)
    if bike_serializer.is_valid() is False:
        return JsonResponse(bike_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    bike_serializer.save()
    bike_response = BikeResponse(
        bike_serializer.data.get('name'),
        bike_serializer.data.get('weight'),
        bike_serializer.data.get('user'),
        bike_serializer.data.get('id'))
    return JsonResponse(bike_response.__dict__, status=status.HTTP_201_CREATED)