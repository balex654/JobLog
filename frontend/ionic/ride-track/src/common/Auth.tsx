import { LocalStorageCache } from "@auth0/auth0-react";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { Storage } from "@ionic/storage";

export const cacheAuthKey = "auth0spajs@@::NNEnH1PYbXV0BXONtkQlg4hD30X9uo0r::https://ride-track-backend-gol2gz2rwq-uc.a.run.app";

export const getAccessToken = async (storage: Storage): Promise<JwtPayload> => {
    let accessToken;
    if (process.env.REACT_APP_ENV! === "dev") {
        accessToken = await storage.get('accessToken');
    }
    else {
        const cache = new LocalStorageCache();
        const key = cache.allKeys().find(k => k.includes(cacheAuthKey));
        const authData = cache.get(key!) as any;
        accessToken = authData.body.access_token;
    }

    return jwtDecode<JwtPayload>(accessToken);
}