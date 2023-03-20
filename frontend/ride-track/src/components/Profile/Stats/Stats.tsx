import "./Stats.css";

const Stats = () => {
    return (
        <div className="stats-container">
            <p className="title">
                Stats
            </p>
            <div className="stat-field">
                <p>Longest ride (unit):</p>
                <p className="data">100</p>
            </div>
            <div className="stat-field">
                <p>Top speed (unit):</p>
                <p className="data">100</p>
            </div>
            <div className="stat-field">
                <p>Total distance this year (unit):</p>
                <p className="data">100</p>
            </div>
            <div className="stat-field">
                <p>Total distance this month (unit):</p>
                <p className="data">100</p>
            </div>
            <p className="bike-header">Bike1</p>
            <div className="stat-field">
                <p>Total distance (unit):</p>
                <p className="data">100</p>
            </div>
            <div className="stat-field">
                <p>Average speed (unit):</p>
                <p className="data">100</p>
            </div>
            <div className="stat-field">
                <p>Average power (unit):</p>
                <p className="data">100</p>
            </div>
            <p className="bike-header">Bike2</p>
            <div className="stat-field">
                <p>Total distance (unit):</p>
                <p className="data">100</p>
            </div>
            <div className="stat-field">
                <p>Average speed (unit):</p>
                <p className="data">100</p>
            </div>
            <div className="stat-field">
                <p>Average power (unit):</p>
                <p className="data">100</p>
            </div>
        </div>
    )
}

export default Stats;