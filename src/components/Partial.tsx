import { h } from "../lib/createelement";

const Partial = ({ items }: any) => {
    const elms = items.map((item) => <span>{item}</span>);
    return <div>{elms}</div>;
};
export default Partial;
