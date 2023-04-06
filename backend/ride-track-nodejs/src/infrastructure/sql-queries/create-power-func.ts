export const CreatePowerFunc = `
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
`;