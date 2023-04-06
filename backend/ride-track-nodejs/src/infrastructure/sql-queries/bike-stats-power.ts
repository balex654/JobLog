export const BikeStatsPower = `
    SELECT bike_name, AVG(power) AS average_power FROM (
        WITH trip AS (
            SELECT 
                bike_id,
                activity_id,
                start_date,
                end_date,
                user_id,
                total_mass,
                latitude AS lat1,
                longitude AS lon1,
                altitude AS alt1,
                date AS date1,
                speed AS speed1,
                bike_name,
                LEAD(latitude) OVER (PARTITION BY activity_id ORDER BY date) AS lat2,
                LEAD(longitude) OVER (PARTITION BY activity_id ORDER BY date) AS lon2,
                LEAD(altitude) OVER (PARTITION BY activity_id ORDER BY date) AS alt2,
                LEAD(date) OVER (PARTITION BY activity_id ORDER BY date) AS date2,
                LEAD(speed) OVER (PARTITION BY activity_id ORDER BY date) AS speed2
            FROM
            (SELECT
                latitude, longitude, altitude, date, activity_id, bike_id, start_date, 
                end_date, a.user_id as user_id, total_mass, b.name as bike_name, speed
            FROM ride_track_app_activity a JOIN ride_track_app_gpspoint g ON a.id = g.activity_id JOIN ride_track_app_bike b on a.bike_id = b.id) AS point_activity
            ORDER BY date
        )
        SELECT
            activity_id AS id,
            bike_id,
            start_date,
            end_date,
            user_id,
            total_mass,
            bike_name,
            AVG(get_power(lat1, lon1, alt1, date1, lat2, lon2, alt2, date2, speed1, speed2, total_mass)) AS power
        FROM trip
        WHERE user_id = ? AND get_power(lat1, lon1, alt1, date1, lat2, lon2, alt2, date2, speed1, speed2, total_mass) > 0
        GROUP BY activity_id, bike_id, start_date, end_date, user_id, total_mass, bike_name
    ) AS bike_stats_by_activity GROUP BY bike_id, bike_name;
`;