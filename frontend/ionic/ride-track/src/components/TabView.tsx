import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react"
import { ellipse, square, triangle } from "ionicons/icons"
import { Redirect, Route } from "react-router-dom"
import Tab1 from "../pages/Tab1"
import Tab2 from "../pages/Tab2"
import Tab3 from "../pages/Tab3"
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from "react";

const TabView = () => {
    const { user } = useAuth0();

    useEffect(() => {
        console.log(user);    
    });

    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/tab1">
                    <Tab1 />
                </Route>
                <Route exact path="/tab2">
                    <Tab2 />
                </Route>
                <Route exact path="/tab3">
                    <Tab3 />
                </Route>
                <Route exact path="/">
                    <Redirect to="/tab1" />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/tab1">
                    <IonIcon icon={triangle} />
                    <IonLabel>Tab 1</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tab2">
                    <IonIcon icon={ellipse} />
                    <IonLabel>Tab 2</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tab3">
                    <IonIcon icon={square} />
                    <IonLabel>Tab 3</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export default TabView;