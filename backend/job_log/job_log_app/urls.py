from django.urls import path

from .api import user_controller

urlpatterns = [
    path('user', user_controller.user)
]