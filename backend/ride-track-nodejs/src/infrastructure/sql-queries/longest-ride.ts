export const LongestRideQuery: string = `
    WITH trip AS (
        SELECT 
            name,
            bike_id,
            activity_id,
            start_date,
            end_date,
            moving_time,
            user_id,
            total_mass,
            latitude AS lat1,
            longitude AS lon1,
            LEAD(latitude) OVER (PARTITION BY activity_id ORDER BY date) AS lat2,
            LEAD(longitude) OVER (PARTITION BY activity_id ORDER BY date) AS lon2
        FROM
        (SELECT
            latitude, longitude, date, activity_id, name, bike_id, start_date, end_date, moving_time, user_id, total_mass
        FROM ride_track_app_activity a JOIN ride_track_app_gpspoint g ON a.id = g.activity_id) AS point_activity
        ORDER BY date
    )
    SELECT
        activity_id AS id,
        name,
        bike_id,
        start_date,
        end_date,
        moving_time,
        user_id,
        total_mass,
        SUM(
            6371000 * acos(
                cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
                sin(radians(lat1)) * sin(radians(lat2))
            )
        ) AS total_distance
    FROM trip
    WHERE user_id = ?
    GROUP BY activity_id, name, bike_id, start_date, end_date, moving_time, user_id, total_mass
    ORDER BY total_distance DESC LIMIT 1;
`;