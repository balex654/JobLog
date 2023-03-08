import { sqlite } from "../../App"

export const InitDb = async () => {
    const db = await sqlite.createConnection("ride-track-db", false, "no-encryption", 1);
    await db.open();
    let response: any = await db.execute(createTables);
    if (response.changes.changes < 0) {
        console.log("Error creating tables");
    }
}

const createTables: string = `
    CREATE TABLE IF NOT EXISTS activity (
        id INTEGER PRIMARY KEY NOT NULL,
        user_id TEXT,
        moving_time INTEGER,
        name TEXT,
        start_date DATE,
        end_date DATE
    );
    CREATE TABLE IF NOT EXISTS gps_point (
        id INTEGER PRIMARY KEY NOT NULL,
        activity_id INTEGER NOT NULL,
        altitude FLOAT,
        latitude FLOAT,
        longitude FLOAT,
        speed FLOAT,
        date INTEGER,
        FOREIGN KEY (activity_id) REFERENCES activity(id) ON DELETE CASCADE
    );
`