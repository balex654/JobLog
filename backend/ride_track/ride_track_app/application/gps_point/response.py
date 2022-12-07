class GpsPointResponse():
    def __init__(self, date, speed, latitude, longitude, altitude):
        self.date = date
        self.speed = speed
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude

class GpsPointsResponse():
    def __init__(self, gps_points):
        self.gps_points = gps_points