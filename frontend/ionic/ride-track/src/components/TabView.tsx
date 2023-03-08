import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react"
import { person, play, bicycle, arrowUp } from "ionicons/icons"
import { Redirect, Route } from "react-router-dom"
import Tab3 from "../pages/Tab3"
import Bikes from "./bikes/Bikes"
import TrackActivity from "./track-activity/TrackActivity"
import UploadActivity from "./upload-activity/UploadActivity"

const TabView = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route path="/tab-view/track-activity" component={TrackActivity}/>
                <Route path="/tab-view/upload-activity" component={UploadActivity}/>
                <Route path="/tab-view/bikes" component={Bikes}/>
                <Route path="/tab-view/tab3" component={Tab3}/>
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
                    <IonLabel>Unsynced Activities</IonLabel>
                </IonTabButton>
                <IonTabButton tab="bikes" href="/tab-view/bikes">
                    <IonIcon icon={bicycle} />
                    <IonLabel>Bikes</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tab-view/tab3">
                    <IonIcon icon={person} />
                    <IonLabel>Tab 3</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export default TabView;