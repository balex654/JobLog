from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from ride_track_app.application.bike.form import BikeForm
from ride_track_app.application.bike.response import BikeResponse
from ride_track_app.domain.bike.serializer import BikeSerializer
from ride_track_app.domain.bike.model import Bike

def edit(request, id):
    form = BikeForm(data=JSONParser().parse(request))
    if not form.is_valid():
        return JsonResponse(form.errors, status=status.HTTP_400_BAD_REQUEST)

    bike_query = Bike.objects.filter(
        user_id=request.oauth_token.sub,
        id=id)
    if bike_query.count() == 0:
        error = {
            'error': 'bike not found'
        }
        return JsonResponse(error, status=status.HTTP_404_NOT_FOUND)

    bike = bike_query[0]
    bike.name = form.data.get('name')
    bike.weight = form.data.get('weight')
    bike.save()

    bike_response = BikeResponse(
        name=bike.name,
        weight=bike.weight,
        user_id=bike.user.id,
        id=bike.pk
    )
    return JsonResponse(bike_response.__dict__, status=status.HTTP_200_OK)