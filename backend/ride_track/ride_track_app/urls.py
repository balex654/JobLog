from django.urls import path

from .api import gps_point_controller, user_controller, activity_controller, bike_controller

urlpatterns = [
    path('user', user_controller.user),
    path('activity', activity_controller.activity),
    path('activity/<int:id>', activity_controller.activity_id),
    path('bike', bike_controller.bike),
    path('bike/<int:id>', bike_controller.bike_id),
    path('activity/<int:activity_id>/gps-point', gps_point_controller.gps_points_by_activity)
]