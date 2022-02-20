import Cart from "../components/Cart";
import { h, Fragment } from "../lib/createelement";

export default function CartPage(props) {
    return <Cart {...props} />;
}

export const loadProps = () => ({
    articleNumber: "16694",
    mainOperatingChain: "OCSEELG",
    sellability: {
        buyableOnline: true,
        buyableInternet: true,
        buyableCollectAtStore: true,
    },
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
});

// export const loadProps = () =>
//     new Promise((res, _) => {
//         setTimeout(() => {
//             res({
//                 articleNumber: "16694",
//                 mainOperatingChain: "OCSEELG",
//                 sellability: {
//                     buyableOnline: true,
//                     buyableInternet: true,
//                     buyableCollectAtStore: true,
//                 },
//                 marketingContent: { advertisingText: ".", disclaimer: null, badgeUrl: "" },
//                 prices: {
//                     currency: "SEK",
//                     activePrice: 12996,
//                     activePriceExVAT: 10396.8,
//                     displaySavePrice: false,
//                 },
//                 availability: { availableBItemGradeCount: 0, availableForCollectAtStoreCount: 0 },
//                 relationships: { cheapestBItem: null },
//                 qlc: { active: false, recaptchaRequired: false },
//             });
//         }, 200);
//     });
