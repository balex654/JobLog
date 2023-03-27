import { inject } from "inversify";
import { StatsResponse } from "../../contract/user/stats/stats-response";
import { IUserRepository } from "../../domain/user/iuser-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";
import { ActivityResponse } from "../../contract/activity/activity-response";

export class GetUserStatsQuery {
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository 
        = container.get<IUserRepository>(TYPES.IUserRepository);

    public getUserStats = async (id: string): Promise<ApplicationResponse> => {
        const user = await this.userRepository.getUserById(id);
        if (user === undefined) {
            return {
                status: Status.NotFound,
                resource: new Error('User not found')
            };
        }

        const stats = await this.userRepository.getUserStats(user);
        let statsResponse: StatsResponse | undefined;
        let status: Status = Status.NoContent;
        if (stats.longest_ride !== undefined && stats.top_speed !== undefined) {
            status = Status.Ok;
            statsResponse = new StatsResponse(
                {
                    activity: new ActivityResponse(
                        stats.longest_ride.activity.id!,
                        stats.longest_ride.activity.name,
                        stats.longest_ride.activity.start_date,
                        stats.longest_ride.activity.end_date,
                        stats.longest_ride.activity.moving_time,
                        stats.longest_ride.activity.bike_id,
                        stats.longest_ride.activity.user_id,
                        stats.longest_ride.activity.total_mass
                    ),
                    distance: stats.longest_ride.distance
                },
                {
                    activity: new ActivityResponse(
                        stats.top_speed.activity.id!,
                        stats.top_speed.activity.name,
                        stats.top_speed.activity.start_date,
                        stats.top_speed.activity.end_date,
                        stats.top_speed.activity.moving_time,
                        stats.top_speed.activity.bike_id,
                        stats.top_speed.activity.user_id,
                        stats.top_speed.activity.total_mass
                    ),
                    speed: stats.top_speed.speed
                },
                stats.total_distance_year,
                stats.total_distance_month,
                stats.bike_stats
            )
        }

        return {
            status: status,
            resource: statsResponse
        };
    }
}