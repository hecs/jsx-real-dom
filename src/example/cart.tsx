import Cart from "../components/Cart";
import { h, Fragment } from "../lib/createelement";
import { hydrate } from "../lib/hydrate";

const data = {
    title: "Test artikel",
    imageurl: "about:",
    articleNumber: "16694",
    mainOperatingChain: "OCSEELG",
    sellability: { buyableOnline: true, buyableInternet: true, buyableCollectAtStore: true },
    marketingContent: { advertisingText: ".", disclaimer: null, badgeUrl: "" },
    prices: {
        currency: "SEK",
        activePrice: 12996,
        activePriceExVAT: 10396.8,
        displaySavePrice: false,
    },
    availability: { availableBItemGradeCount: 0, availableForCollectAtStoreCount: 0 },
    relationships: { cheapestBItem: null },
    qlc: { active: false, recaptchaRequired: false },
};

globalThis.loadProps = () => {
    return data;
};

hydrate(<Cart {...data} />);
