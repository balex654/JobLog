from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from django.http.response import HttpResponse
from rest_framework import status

from ride_track_app.application.activity.form import ActivityForm
from ride_track_app.domain.activity.serializer import ActivitySerializer
from ride_track_app.domain.gps_point.serializer import GpsPointSerializer

def add(request):
    activity_data = JSONParser().parse(request)
    form = ActivityForm(data=activity_data)
    if not form.is_valid():
        return JsonResponse(form.errors, status=status.HTTP_400_BAD_REQUEST)

    activity_model_data = {
        'name': form.data.get('name'),
        'start_date': form.data.get('start_date'),
        'end_date': form.data.get('end_date'),
        'moving_time': form.data.get('moving_time'),
        'bike': form.data.get('bike_id'),
        'user': request.oauth_token.sub,
        'total_mass': form.data.get('total_mass')
    }
    activity_serializer = ActivitySerializer(data=activity_model_data)
    if activity_serializer.is_valid() is False:
        return JsonResponse(activity_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    activity_serializer.save()

    gps_point_model_data = list(map(lambda gps: {
        'date': gps.get('date'),
        'latitude': gps.get('latitude'),
        'longitude': gps.get('longitude'),
        'altitude': gps.get('altitude'),
        'speed': gps.get('speed'),
        'activity': activity_serializer.data.get('id')
    }, form.data.get('gps_points')))
    gps_point_serializer = GpsPointSerializer(data=gps_point_model_data, many=True)
    if gps_point_serializer.is_valid() is False:
        return JsonResponse(gps_point_serializer.errors, status=status.HTTP_400_BAD_REQUEST, safe=False)
    gps_point_serializer.save()

    return HttpResponse(status=status.HTTP_201_CREATED)