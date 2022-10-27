from django.urls import path

from .api import user_controller, activity_controller

urlpatterns = [
    path('user', user_controller.user),
    path('activity', activity_controller.activity)
]