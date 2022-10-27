from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('ride_track_app', '0007_bike'),
    ]

    operations = [
        migrations.RunSQL('alter table ride_track_app_bike drop constraint ride_track_app_bike_user_id_e2c8819b_fk_ride_track_app_user_id'),
        migrations.RunSQL('alter table ride_track_app_bike add constraint ride_track_app_bike_user_id_e2c8819b_fk_ride_track_app_user_id foreign key (user_id) references ride_track_app_user(id) on delete cascade'),
        migrations.RunSQL('alter table ride_track_app_activity drop constraint ride_track_app_activ_bike_id_db89b8f3_fk_ride_trac'),
        migrations.RunSQL('alter table ride_track_app_activity add constraint ride_track_app_activ_bike_id_db89b8f3_fk_ride_trac foreign key (bike_id) references ride_track_app_bike(id) on delete cascade')
    ]