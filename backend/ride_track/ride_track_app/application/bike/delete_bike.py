from django.http.response import JsonResponse
from django.http.response import HttpResponse
from rest_framework import status

from ride_track_app.domain.bike.model import Bike

def delete_bike(request, id):
    bike_query = Bike.objects.filter(
        user_id=request.oauth_token.sub,
        id=id)
    if bike_query.count() == 0:
        error = {
            'error': 'bike not found'
        }
        return JsonResponse(error, status=status.HTTP_404_NOT_FOUND)

    bike = bike_query[0]
    bike.is_deleted = True
    bike.save()

    return HttpResponse(status=status.HTTP_204_NO_CONTENT)