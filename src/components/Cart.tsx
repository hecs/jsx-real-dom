import { h, Fragment } from "../lib/createelement";
import { cachedPromise } from "../lib/utils/promiseCache";
import { useTranslations } from "../lib/utils/translate";
import { useQuery } from "../lib/hooks/useQuery";
import { useState } from "../lib/hooks/useState";
import { cartTranslations } from "./cart-translations";
import { createEventChange } from "../lib/utils/events";

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const opensAt = (openHours) => {
    const date = new Date();

    const normalHours = openHours[days[date.getDay()]];
    //console.log(normalHours);
    const opensAt = normalHours.Opening.Hours;
    const closesAt = normalHours.Closing.Hours;
    const currentHour = date.getHours();
    if (opensAt > currentHour) {
        return `Lukket. Åbner kl. ${opensAt}`;
    }
    if (closesAt <= currentHour) {
        return `Lukket. Åbner i morgen kl. ${opensAt}`;
    }
    return `Öppet, stänger kl. ${closesAt}`;
};

const t = useTranslations(cartTranslations);

const MINUTE = 60 * 1000;
const HOUR = MINUTE * 60;

const getTime = (timeString) => {
    const pickupTime = new Date(timeString);
    const now = new Date();
    const diff = pickupTime.getTime() - now.getTime();
    if (diff <= HOUR * 2) {
        return t("collect.message.at.hour", { time: 1 });
    }
    if (diff < HOUR * 4) {
        const hourDiff = Math.ceil(diff / HOUR);
        return t("collect.message.at.hours", { time: hourDiff });
    }

    return t("collect.message.noSuffix.onDate", { date: pickupTime.toLocaleDateString() });
};

const productOptions = {
    headers: {
        Accept: "application/json",
        isB2BCustomer: "false",
    },
};

const getClosestStore = (articleNumber, { longitude, latitude }) =>
    cachedPromise(`store-${articleNumber}`, () =>
        fetch(
            `https://ecom.knatofs.se/Masterdata/Organization/v3/MainOperatingChain/OCSEELG/NearbyStoresWithProduct/${articleNumber}/?longitude=${longitude}&latitude=${latitude}&distanceThresholdKm=200`,
            { mode: "no-cors" }
        ).then((d) => d.json())
    );

const addToCart = createEventChange("add-to-cart");

const Store = ({
    Name,
    DistanceFromOriginKilometers,
    InStock,
    PickupTime,
    Address,
    OpeningHours,
    cartItem,
}: any = {}) => {
    const { City, Street, HouseNumber, PostalCode } = Address || {};
    return (
        <div className="store">
            <div>
                <strong>{Name}</strong>&nbsp;∙&nbsp;
                <span>{Math.round(DistanceFromOriginKilometers)} km</span>
            </div>
            <div>
                <span className={"stock " + InStock ? "green" : "red"}>
                    {t(InStock ? "availability.inStock" : "availability.notAvailable")}
                </span>
                {}
                <span>{getTime(PickupTime)}</span>
            </div>
            <div>{opensAt(OpeningHours)}</div>
            <span class="address">
                {Street} {HouseNumber}, {PostalCode} {City}
            </span>

            <button className="addtocart" onClick={addToCart(cartItem)}>
                {t("addtocart")}
            </button>
        </div>
    );
};

const Placeholder = ({ noi, height }) => {
    const elms: Node[] = [];
    for (var i = 0; i < noi; i++) {
        elms.push(
            <div
                key={`ph${i}`}
                className="placeholder"
                style={{ height, marginBottom: "0.625rem" }}
            >
                {}
            </div>
        );
    }

    return <>{elms}</>;
};

const requestLocationAndFetchStores = (articleNumber) => () =>
    new Promise((res, _) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getClosestStore(articleNumber, { latitude, longitude }).then(res);
        });
    });

const Cart = ({ articleNumber, title, imageurl, ...dynamic }) => {
    const [activeTab, setActiveTab] = useState(0);
    const { isLoading, data: stores } = useQuery(
        requestLocationAndFetchStores(articleNumber),
        ["store", activeTab],
        {
            enabled: activeTab == 1 && articleNumber,
        }
    );

    const { availability = {}, sellability = {} } = dynamic || {};

    const cartItem = { articleNumber: articleNumber, imageUrl: imageurl, title, amount: 1 };

    const cisDisabled = !sellability.buyableCollectAtStore;
    const storesNumber = availability.availableForCollectAtStoreCount || 0;

    const { PrimaryStore: primary, CloseByStores: close } = stores || {};
    const storeElm =
        stores && !isLoading ? (
            [primary, ...close].map((store) => (
                <Store key={store.id} {...store} cartItem={cartItem} />
            ))
        ) : (
            <Placeholder noi={Math.min(storesNumber, 3)} height="204px" />
        );

    return (
        <div>
            <div className="tabs">
                <div className="btns">
                    <button
                        onClick={() => setActiveTab(0)}
                        className={activeTab == 0 && "selected"}
                    >
                        <span>{t("homeDeliveryHeadline")}</span>
                        <i>{}</i>
                    </button>
                    <button
                        onClick={() => !cisDisabled && setActiveTab(1)}
                        className={cisDisabled ? "disabled" : activeTab == 1 && "selected"}
                    >
                        <span>{t("storeDeliveryHeadline")}</span>
                        {!cisDisabled && <i>{t("stores.storesNearYou", { storesNumber })}</i>}
                    </button>
                </div>
                <div>
                    {activeTab == 0 && (
                        <div className="tab pn">
                            <p>{t("availability.seeAllInCheckout")}</p>
                            <button onClick={addToCart(cartItem)} className="addtocart">
                                {t("addtocart")}
                            </button>
                        </div>
                    )}
                    {activeTab == 1 && <div className="tab pn">{storeElm}</div>}
                </div>
            </div>
        </div>
    );
};

export default Cart;
