class ActivityResponse():
    def __init__(self, name, start_date, end_date, moving_time, user_id, bike_id, id, total_mass):
        self.name = name
        self.start_date = start_date
        self.end_date = end_date
        self.moving_time = moving_time
        self.user_id = user_id
        self.bike_id = bike_id
        self.id = id,
        self.total_mass = total_mass

class ActivitiesResponse():
    def __init__(self, activities):
        self.activities = activities