SELECT bike_name, SUM(total_distance) AS total_distance, AVG(average_speed) AS average_speed FROM (
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
		SUM(
			6371000 * acos(
				cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
				sin(radians(lat1)) * sin(radians(lat2))
			)
		) AS total_distance,
		AVG(speed1) AS average_speed
	FROM trip
	WHERE user_id = 'auth0|6352e2b5a12752ff48fd3b64'
	GROUP BY activity_id, bike_id, start_date, end_date, user_id, total_mass, bike_name
) AS bike_stats_by_activity GROUP BY bike_id, bike_name;

----

CREATE OR REPLACE FUNCTION get_power(
	lat1 double precision, lon1 double precision, alt1 double precision, date1 timestamp with time zone, 
	lat2 double precision, lon2 double precision, alt2 double precision, date2 timestamp with time zone, 
	speed1 double precision, speed2 double precision, mass double precision) RETURNS numeric
AS $BODY$
	DECLARE
		distance numeric;
		time_diff numeric;
		force_acc numeric;
		force_air numeric;
		force_incline numeric;
		work numeric;
	BEGIN
		time_diff := extract(epoch from date2 - date1);
		distance := 6371000 * acos(
			cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
			sin(radians(lat1)) * sin(radians(lat2)));
		IF time_diff = 0 OR distance = 0 THEN
			RETURN 0;
		END IF;
		force_acc := ((speed1 - speed2) / time_diff) * mass;
		force_air := power(((speed1 + speed2) / 2), 2) * .5 * 1.2 * .6;
		force_incline := sin(atan((alt2 - alt1) / distance)) * mass * 9.8;
		work := (force_acc + force_air + force_incline) * distance;
		RETURN (work / time_diff) * 0.67;
	END;
$BODY$ LANGUAGE plpgsql;

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
	WHERE user_id = 'auth0|6352e2b5a12752ff48fd3b64' AND get_power(lat1, lon1, alt1, date1, lat2, lon2, alt2, date2, speed1, speed2, total_mass) > 0
	GROUP BY activity_id, bike_id, start_date, end_date, user_id, total_mass, bike_name
) AS bike_stats_by_activity GROUP BY bike_id, bike_name;