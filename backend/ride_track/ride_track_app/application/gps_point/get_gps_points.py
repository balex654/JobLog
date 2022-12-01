from ride_track_app.application.bike.response import BikeResponse
from django.http.response import JsonResponse
from rest_framework import status

from ...domain.gps_point.model import GpsPoint
from ...domain.gps_point.serializer import GpsPointSerializer
from .response import GpsPointResponse, GpsPointsResponse

def get_gps_points(request, activity_id):
    gps_point_query = GpsPoint.objects.filter(
        activity=activity_id,
        activity__user=request.oauth_token.sub).all().order_by('date')
    gps_point_serializer = GpsPointSerializer(gps_point_query, many=True)
    gps_points_response = GpsPointsResponse(list(map(lambda gps_points_data: GpsPointResponse(
        date=gps_points_data.get('date'),
        speed=gps_points_data.get('speed'),
        latitude=gps_points_data.get('latitude'),
        longitude=gps_points_data.get('longitude'),
        altitude=gps_points_data.get('altitude')
    ).__dict__, gps_point_serializer.data)))
    return JsonResponse(gps_points_response.__dict__, status=status.HTTP_200_OK)