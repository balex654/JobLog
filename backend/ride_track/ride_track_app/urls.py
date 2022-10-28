from django.urls import path

from .api import user_controller, activity_controller, bike_controller

urlpatterns = [
    path('user', user_controller.user),
    path('activity', activity_controller.activity),
    path('bike', bike_controller.bike),
    path('bike/<int:id>', bike_controller.bike_id)
]