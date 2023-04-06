export const DistanceMTD = `
    SELECT SUM(total_distance) * 1000 as distance_mtd FROM (WITH trip AS (
        SELECT 
            user_id,
            activity_id,
            start_date,
            latitude AS lat1,
            longitude AS lon1,
            LEAD(latitude) OVER (PARTITION BY activity_id ORDER BY date) AS lat2,
            LEAD(longitude) OVER (PARTITION BY activity_id ORDER BY date) AS lon2
        FROM
        (SELECT
            latitude, longitude, date, activity_id, start_date, user_id
        FROM ride_track_app_activity a JOIN ride_track_app_gpspoint g ON a.id = g.activity_id) AS point_activity
        ORDER BY date
    )
    SELECT
        activity_id AS id,
        start_date,
        user_id,
        SUM(
            6371 * acos(
                cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
                sin(radians(lat1)) * sin(radians(lat2))
            )
        ) AS total_distance
    FROM trip
    WHERE user_id = ? and date_part('month', start_date) = date_part('month', CURRENT_DATE)
    GROUP BY activity_id, start_date, user_id) as d;
`;