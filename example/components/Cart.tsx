import { h, Fragment } from "../../src/lib/createelement";
import { cachedPromise } from "../../src/lib/utils/promiseCache";
import { useTranslations } from "../../src/lib/utils/translate";
import { useQuery } from "../../src/lib/hooks/useQuery";
import { useState } from "../../src/lib/hooks/useState";
import { cartTranslations } from "./cart-translations";
import { createEventChange } from "../../src/lib/utils/events";

const t = useTranslations(cartTranslations);

const opensAt = (openHours) => {
    const date = new Date();

    const { opening, closing } = openHours.normal[date.getDay()];

    const opensAt = opening.hours;
    const closesAt = closing.hours;
    const currentHour = date.getHours();
    if (opensAt > currentHour) {
        return t("openingHours.opensOn", { day: "", time: opensAt });
    }
    if (closesAt <= currentHour) {
        return t("openingHours.opensOn", { day: "imorgon", time: opensAt });
    }
    return t("openingHours.open", { time: closesAt });
};

const getTime = (state, deliveryTime, pickupTime) => {
    if (state > 0) {
        if (pickupTime <= 60) {
            return t("collectInMinutes", { time: Math.round(pickupTime) });
        }
        if (pickupTime < 60 * 8) {
            return t("collectInHours", { time: Math.ceil(pickupTime / 60) });
        }
        if (pickupTime < 60 * 18) {
            return t("collectInDay");
        }
    }
    return t("collectInDays", { time: deliveryTime });
};

const getArticleStatus = (sku) =>
    cachedPromise(`stats-${sku}`, () =>
        fetch(`https://ecom.knatofs.se/cart-module/statsForProduct/${sku}`).then((d) => d.json())
    );

const getClosestStore = (sku, { longitude, latitude }) =>
    cachedPromise(`store-${sku}`, () =>
        fetch(
            `https://ecom.knatofs.se/cart-module/storesWithProduct/${sku}/?lng=${longitude}&lat=${latitude}` //&distance=200
        ).then((d) => d.json())
    );

const addToCart = createEventChange("add-to-cart");

const stockLevels = ["red", "yellow", "green"];

const stockCodes = ["noStock", "lowStock", "inStock"];
const deliveryStockCodes = ["noStock", "lowWarehouse", "inWarehouse"];

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
        <div class="store" onClick={onClick}>
            <div>
                <strong>{displayName}</strong>&nbsp;∙&nbsp;
                <span>{Math.round(distance)} km</span>
            </div>
            <div>
                <span class={"stock " + stockLevels[state]}>{t(stockCodes[state])}</span>,&nbsp;
                <span>{getTime(state, deliveryTime, pickupTime)}</span>
            </div>
            <div>{opensAt(openHours)}</div>
            {open && (
                <div>
                    <span class="address">{address}</span>

                    <button class="addtocart" onClick={addToCart(cartItem)}>
                        {t("addtocart")}
                    </button>
                </div>
            )}
        </div>
    );
};

const Placeholder = ({ noi }) => {
    const elms: Node[] = [];

    for (var i = 0; i < noi; i++) {
        const height = i === 0 ? "182px" : "93px";
        elms.push(
            <div class="placeholder" style={{ height, marginBottom: "0.625rem" }}>
                {}
            </div>
        );
    }

    return <div>{elms}</div>;
};
type Location = {
    latitude: number;
    longitude: number;
};

const getLocation = (): Promise<Location> =>
    new Promise((res, rej) => {
        const storedLocation = localStorage.getItem("lastLocation");
        if (storedLocation) {
            const lastLocation = JSON.parse(storedLocation);
            if (lastLocation.ts > Date.now() - 60 * 60 * 1000) {
                res(lastLocation);
                return;
            }
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const loc = { latitude, longitude, ts: Date.now() };
                localStorage.setItem("lastLocation", JSON.stringify(loc));
                res(loc);
            },
            () => {
                res({ longitude: 15.7431222, latitude: 60.5977311 });
                console.log("unable to fetch location");
            },
            { maximumAge: 1000000 }
        );
    });

const limit = (arr = [], limit = 10): any[] => arr.slice(0, Math.min(limit, arr.length));

const requestLocationAndFetchStores = (sku) => () =>
    cachedPromise("stores-" + sku || "none", () =>
        getLocation().then((pos) => getClosestStore(sku, pos))
    );

const Cart = ({ sku, cis }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [visibleNoi, setVisibleNoi] = useState(6);
    const [open, setOpen] = useState("");
    const enabled = activeTab == 1 && sku;
    const { data: stats, isLoading: loadingStats } = useQuery(
        () => getArticleStatus(sku),
        ["stats", sku],
        {
            enabled: Boolean(sku),
        }
    );
    const { isLoading, data } = useQuery(
        requestLocationAndFetchStores(sku),
        ["store", activeTab, sku],
        {
            enabled,
        }
    );

    const storesNumber = stats?.storeCount || cis;
    const cartItem = { sku, noi: 1 };

    const { available, stores } = data || {};

    const getStoreData = (id, rest) => ({ ...stores.find((d) => d.id == id), id, ...rest });

    const storeElm =
        isLoading || !enabled ? (
            <Placeholder noi={Math.min(storesNumber, 6) + 1} />
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
            <div class="tabs">
                <div class="btns">
                    <button
                        onClick={() => setActiveTab(0)}
                        class={activeTab == 0 && "selected"}
                    >
                        <span>{t("homeDeliveryHeadline")}</span>
                        <i>{t(deliveryStockCodes[stats?.delivery || 0])}</i>
                    </button>
                    <button
                        onClick={() => cis > 0 && setActiveTab(1)}
                        class={activeTab == 1 && "selected"}
                    >
                        <span>{t("storeDeliveryHeadline")}</span>
                        {cis > 0 && <i>{t("stores.storesNearYou", { storesNumber })}</i>}
                    </button>
                </div>
                <div>
                    {activeTab == 0 && (
                        <div class="tab pn">
                            <p>{t("availability.seeAllInCheckout")}</p>
                            <button onClick={addToCart(cartItem)} class="addtocart">
                                {t("addtocart")}
                            </button>
                        </div>
                    )}
                    {activeTab == 1 && (
                        <div class="tab pn">
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
