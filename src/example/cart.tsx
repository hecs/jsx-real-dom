import Cart from "../components/Cart";
import { createActiveElement } from "../lib/createCustomElement";
import { h, Fragment } from "../lib/createelement";

const data = {
    title: "Test artikel",
    imageUrl: "about:",
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
    availability: { availableBItemGradeCount: 0, availableForCollectAtStoreCount: 20 },
    relationships: { cheapestBItem: null },
    qlc: { active: false, recaptchaRequired: false },
};

createActiveElement("add-to-cart", (attrs) => <Cart {...data} />, ["sku"]);
//hydrate(<Cart {...data} />);
