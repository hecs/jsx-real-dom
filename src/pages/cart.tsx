import Cart from "../components/Cart";
import { h, Fragment } from "../lib/createelement";

export default function CartPage({ articleNumber, cis }) {
    return <Cart articleNumber={articleNumber} cis={cis} />;
}
