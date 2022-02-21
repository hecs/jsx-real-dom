import { h, Fragment } from "../lib/createelement";
import { cachedPromise } from "../lib/utils/promiseCache";
import { useTranslations } from "../lib/utils/translate";
import { useQuery } from "../lib/hooks/useQuery";
import { useState } from "../lib/hooks/useState";
import { cartTranslations } from "./cart-translations";
import { createEventChange } from "../lib/utils/events";

const opensAt = (openHours) => {
    const date = new Date();

    const normalHours = openHours.normal[date.getDay()];

    const opensAt = normalHours.opening.hours;
    const closesAt = normalHours.closing.hours;
    const currentHour = date.getHours();
    if (opensAt > currentHour) {
        return t("openingHours.open", { day: "", time: closesAt });
    }
    if (closesAt <= currentHour) {
        return t("openingHours.opensOn", { day: "imorgon", time: opensAt });
    }
    return `Öppet, stänger kl. ${closesAt}`;
};

const t = useTranslations(cartTranslations);

const getTime = (state, deliveryTime, pickupTime) => {
    if (state > 0) {
        if (pickupTime <= 60) {
            return t("collectInMinutes", { time: Math.round(pickupTime) });
        }
        if (pickupTime < 60 * 8) {
            const hourDiff = Math.ceil(pickupTime / 60);
            return t("collectInHours", { time: hourDiff });
        }
        return t("collect.message.noSuffix.days", { time: Math.ceil(pickupTime / (60 * 24)) });
    }
    return t("collect.message.noSuffix.days", { time: deliveryTime });
};

const getClosestStore = (articleNumber, { longitude, latitude }) =>
    cachedPromise(`store-${articleNumber}`, () =>
        fetch(
            `https://ecom.knatofs.se/cart-module/storesWithProduct/${articleNumber}/?lng=${longitude}&lat=${latitude}&distance=200`
        ).then((d) => d.json())
    );

const addToCart = createEventChange("add-to-cart");

const stockLevels = ["red", "yellow", "green"];

const stockCodes = ["noStock", "lowStock", "inStock"];

const Store = ({
    displayName,
    open = false,
    distance,
    state,
    address,
    deliveryTime,
    openHours,
    onClick = (e) => {},
    pickupTime = 30,
    cartItem,
}: any = {}) => {
    return (
        <div className="store" onClick={onClick}>
            <div>
                <strong>{displayName}</strong>&nbsp;∙&nbsp;
                <span>{Math.round(distance)} km</span>
            </div>
            <div>
                <span className={"stock " + stockLevels[state]}>{t(stockCodes[state])}</span>,&nbsp;
                <span>{getTime(state, deliveryTime, pickupTime)}</span>
            </div>
            <div>{opensAt(openHours)}</div>
            {open && (
                <div>
                    <span class="address">{address}</span>

                    <button className="addtocart" onClick={addToCart(cartItem)}>
                        {t("addtocart")}
                    </button>
                </div>
            )}
        </div>
    );
};

const Placeholder = ({ noi, height }) => {
    const elms: Node[] = [];
    for (var i = 0; i < noi; i++) {
        elms.push(
            <div className="placeholder" style={{ height, marginBottom: "0.625rem" }}>
                Loading
            </div>
        );
    }

    return <div>{elms}</div>;
};

const limit = (arr = [], limit = 10): any[] => arr.slice(0, Math.min(limit, arr.length));

const requestLocationAndFetchStores = (articleNumber) => () =>
    new Promise((res, _) => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getClosestStore(articleNumber, { latitude, longitude }).then(res);
        });
    });

const Cart = ({ articleNumber, title, imageUrl, ...dynamic }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [visibleNoi, setVisibleNoi] = useState(6);
    const [open, setOpen] = useState("");
    const enabled = activeTab == 1 && articleNumber;
    const { isLoading, data } = useQuery(
        requestLocationAndFetchStores(articleNumber),
        ["store", activeTab],
        {
            enabled,
        }
    );

    const { availability = {}, sellability = {} } = dynamic || {};

    const cartItem = { articleNumber: articleNumber, imageUrl, title, amount: 1 };

    const cisDisabled = !sellability.buyableCollectAtStore;
    const storesNumber = availability.availableForCollectAtStoreCount || 0;

    const { available, stores } = data || {};

    const getStoreData = (id, rest) => ({ ...stores.find((d) => d.id == id), id, ...rest });

    const storeElm =
        isLoading || !enabled ? (
            <Placeholder noi={Math.min(storesNumber, 6) + 1} height="204px" />
        ) : (
            limit(available, visibleNoi).map(({ id, ...data }, i) => (
                <Store
                    key={id}
                    {...getStoreData(id, data)}
                    open={open ? open == id : i === 0}
                    onClick={() => setOpen(open === id ? "" : id)}
                    cartItem={cartItem}
                />
            ))
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
                    {activeTab == 1 && (
                        <div className="tab pn">
                            {storeElm}
                            {visibleNoi < available?.length && (
                                <span onClick={() => setVisibleNoi(visibleNoi + 10)}>Mer</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
