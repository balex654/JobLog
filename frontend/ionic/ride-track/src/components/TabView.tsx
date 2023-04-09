import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react"
import { person, play, bicycle, arrowUp, barChart } from "ionicons/icons"
import { Redirect, Route } from "react-router-dom"
import Bikes from "./bikes/Bikes"
import Profile from "./profile/Profile"
import TrackActivity from "./track-activity/TrackActivity"
import UploadActivity from "./upload-activity/UploadActivity"
import Activities from "./activities/Activities"

const TabView = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route path="/tab-view/track-activity" component={TrackActivity}/>
                <Route path="/tab-view/upload-activity" component={UploadActivity}/>
                <Route path="/tab-view/activities" component={Activities}/>
                <Route path="/tab-view/bikes" component={Bikes}/>
                <Route path="/tab-view/profile" component={Profile}/>
                <Route exact path="/tab-view">
                    <Redirect to="/tab-view/track-activity" />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="track-activity" href="/tab-view/track-activity">
                    <IonIcon icon={play} />
                    <IonLabel>Start Activity</IonLabel>
                </IonTabButton>
                <IonTabButton tab="upload-activity" href="/tab-view/upload-activity">
                    <IonIcon icon={arrowUp} />
                    <IonLabel>Upload</IonLabel>
                </IonTabButton>
                <IonTabButton tab="activites" href="/tab-view/activities">
                    <IonIcon icon={barChart}/>
                    <IonLabel>Analysis</IonLabel>
                </IonTabButton>
                <IonTabButton tab="bikes" href="/tab-view/bikes">
                    <IonIcon icon={bicycle} />
                    <IonLabel>Bikes</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/tab-view/profile">
                    <IonIcon icon={person} />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export default TabView;