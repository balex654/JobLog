import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ActivityResponse } from "../../model/activity/ActivityResponse";
import { IStorageService } from "../../services/IStorageService";

interface ActivityProps {
    storageService: IStorageService;
}

const Activity = ({storageService}: ActivityProps) => {
    const { id } = useParams();

    const [activity, setActivity] = useState<ActivityResponse>();

    useEffect(() => {
        const getActivity = async () => {
            const response = await storageService.getActivityById(id!);
            setActivity(response);
        }

        const init = async () => {
            await getActivity();
        }
        
        init();
    }, [storageService, id]);

    return (
        <div>
            {activity?.name}
        </div>
    );
}

export default Activity;