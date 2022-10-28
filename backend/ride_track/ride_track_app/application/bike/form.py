from django import forms

class BikeForm(forms.Form):
    name = forms.CharField(max_length=100, required=True)
    weight = forms.FloatField(required=True)