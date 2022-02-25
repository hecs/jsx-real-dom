// import H from "@here/maps-api-for-javascript";
import { h } from "../../src/lib/createelement";

const getStores = () => fetch("https://ecom.knatofs.se/cart-module/stores").then((d) => d.json());

const Store = ({ displayName, id }) => {
    return (
        <div id={`store${id}`} className="store">
            {displayName}
        </div>
    );
};

function getDistanceInKm([lon1, lat1], [lon2, lat2]) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return Math.round(d);
}
const toRad = Math.PI / 180;

function deg2rad(deg) {
    return deg * toRad;
}

const addDistanceTo = (to) => (store) => ({ ...store, distance: getDistanceInKm(to, store.loc) });
const byDistance = (a, b) => a.distance - b.distance;

const center = [15.7431222, 60.5977311];

const StoreMap = ({}) => {
    let storesParent;

    const renderMap = (elm) => {
        getStores().then((stores) => {
            stores
                .map(addDistanceTo(center))
                .sort(byDistance)
                .forEach((store) => {
                    // const coords = { lat: store.loc[1], lng: store.loc[0] },
                    //     marker = new H.map.Marker(coords, { data: store });
                    // marker.addEventListener(
                    //     "tap",
                    //     () => {
                    //         console.log(store);
                    //         const storeElm = storesParent.querySelector("#store" + store.id);
                    //         storesParent.parentNode.scroll({
                    //             behavior: "smooth",
                    //             left: storeElm.offsetLeft,
                    //             top: 0,
                    //         });
                    //     },
                    //     true
                    // );
                    // map.addObject(marker);
                    // storesParent.append(<Store {...store} />);
                });
        });
        // const platform = new H.service.Platform({
        //     apikey: "cVjVcPOIKwJrXXLR5nZVaN8HBgwrsiXRo28Po1okSDU",
        // });
        // const defaultLayers = platform.createDefaultLayers();

        // const map = new H.Map(elm, defaultLayers.vector.normal.map, {
        //     zoom: 6,
        //     center: { lng: center[0], lat: center[1] },
        // });
        // new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        // const ui = H.ui.UI.createDefault(map, defaultLayers);
        // const mapSettings = ui.getControl("mapsettings")!;
        // const zoom = ui.getControl("zoom")!;
        // const scale = ui.getControl("scalebar")!;
        // mapSettings.setVisibility(true);
        // zoom.setAlignment(H.ui.LayoutAlignment.TOP_RIGHT);
        // scale.setAlignment(H.ui.LayoutAlignment.TOP_RIGHT);
    };

    return (
        <div ref={renderMap} style={{ position: "absolute", width: "800px", height: "600px" }}>
            <div className="storecnt">
                <div ref={(elm) => (storesParent = elm)}></div>
            </div>
        </div>
    );
};

export default StoreMap;
