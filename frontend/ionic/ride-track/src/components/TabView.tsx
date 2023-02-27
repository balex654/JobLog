import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react"
import { ellipse, square, triangle } from "ionicons/icons"
import { Redirect, Route } from "react-router-dom"
import Tab1 from "../pages/Tab1"
import Tab2 from "../pages/Tab2"
import Tab3 from "../pages/Tab3"

const TabView = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route path="/tab-view/tab1" component={Tab1}/>
                <Route path="/tab-view/tab2" component={Tab2}/>
                <Route path="/tab-view/tab3" component={Tab3}/>
                <Route exact path="/tab-view">
                    <Redirect to="/tab-view/tab1" />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/tab-view/tab1">
                    <IonIcon icon={triangle} />
                    <IonLabel>Tab 1</IonLabel>
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