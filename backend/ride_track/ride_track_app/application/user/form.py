from django import forms

class UserForm(forms.Form):
    weight = forms.FloatField(required=True)
    first_name = forms.CharField(max_length=100, required=True)
    last_name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(max_length=200, required=True)
    id = forms.CharField(max_length=200, required=True)