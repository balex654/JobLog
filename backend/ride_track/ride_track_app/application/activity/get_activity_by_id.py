from django.http.response import JsonResponse
from rest_framework import status

from ride_track_app.domain.activity.model import Activity
from ride_track_app.domain.activity.serializer import ActivitySerializer
from ride_track_app.application.activity.response import ActivityResponse

def get_activity_by_id(request, id):
    activity_query = Activity.objects.filter(
        user_id=request.oauth_token.sub,
        id=id)
    if activity_query.count() == 0:
        error = {
            'error': 'activity not found'
        }
        return JsonResponse(error, status=status.HTTP_404_NOT_FOUND)

    activity_serializer = ActivitySerializer(activity_query[0])
    activity_response = ActivityResponse(
        name=activity_serializer.data.get('name'),
        start_date=activity_serializer.data.get('start_date'),
        end_date=activity_serializer.data.get('end_date'),
        moving_time=activity_serializer.data.get('moving_time'),
        user_id=activity_serializer.data.get('user'),
        bike_id=activity_serializer.data.get('bike'),
        id=activity_serializer.data.get('id'),
        total_mass=activity_serializer.data.get('total_mass')
    )
    return JsonResponse(activity_response.__dict__, status=status.HTTP_200_OK)