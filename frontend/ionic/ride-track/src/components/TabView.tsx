import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react"
import { ellipse, square, play } from "ionicons/icons"
import { Redirect, Route } from "react-router-dom"
import Tab2 from "../pages/Tab2"
import Tab3 from "../pages/Tab3"
import TrackActivity from "./track-activity/TrackActivity"

const TabView = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route path="/tab-view/track-activity" component={TrackActivity}/>
                <Route path="/tab-view/tab2" component={Tab2}/>
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
                <IonTabButton tab="tab2" href="/tab-view/tab2">
                    <IonIcon icon={ellipse} />
                    <IonLabel>Tab 2</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tab-view/tab3">
                    <IonIcon icon={square} />
                    <IonLabel>Tab 3</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export default TabView;