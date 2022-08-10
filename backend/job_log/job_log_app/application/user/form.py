from django import forms

class UserForm(forms.Form):
    first_name = forms.CharField(max_length=100)
    last_name = forms.CharField(max_length=100)
    email = forms.EmailField(max_length=200)
    password = forms.CharField(max_length=100)