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

        return {
            status: Status.Ok,
            resource: new StatsResponse(
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
                    activity: undefined,
                    speed: 0
                },
                stats.total_distance_year,
                stats.total_distance_month,
                stats.bike_stats
            )
        };
    }
}