from ride_track_app.application.bike.response import BikeResponse
from django.http.response import JsonResponse
from rest_framework import status

from ride_track_app.domain.activity.model import Activity
from ride_track_app.domain.activity.serializer import ActivitySerializer
from .response import ActivitiesResponse, ActivityResponse

def get_activities(request):
    activity_query = Activity.objects.filter(user_id=request.oauth_token.sub).all().order_by('-start_date')
    activity_serializer = ActivitySerializer(activity_query, many=True)
    activities_response = ActivitiesResponse(list(map(lambda activities_data: ActivityResponse(
        name=activities_data.get('name'),
        start_date=activities_data.get('start_date'),
        end_date=activities_data.get('end_date'),
        moving_time=activities_data.get('moving_time'),
        user_id=activities_data.get('user'),
        bike_id=activities_data.get('bike'),
        id=activities_data.get('id')
    ).__dict__, activity_serializer.data)))
    return JsonResponse(activities_response.__dict__, status=status.HTTP_200_OK)