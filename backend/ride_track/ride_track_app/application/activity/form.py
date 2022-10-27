from django import forms

class ActivityForm(forms.Form):
    name = forms.CharField(max_length=100, required=True)
    start_date = forms.DateTimeField(required=True)
    end_date = forms.DateTimeField(required=True)
    moving_time = forms.FloatField(required=True)
    bike_id = forms.IntegerField(required=True)
    gps_points = forms.JSONField()