import { createContext, useContext } from "../src/lib/createContext";
import { createCustomElement } from "../src/lib/createCustomElement";
import { h } from "../src/lib/createelement";
import { hydrate } from "../src/lib/hydrate";
import { useEffect } from "../src/lib/hooks/useEffect";
import { useState } from "../src/lib/hooks/useState";

const BindingTest = () => {
    const [data, setData] = useState("hej");
    const [idx, setIdx] = useState(0);

    const updateValue = (e) => {
        setData(e.target.value);
        setIdx(idx + 1);
    };
    useEffect(() => {
        console.log("first load only");
    }, []);
    return (
        <div>
            <input value={data} onChange={updateValue} /> data in input {data} {idx}
        </div>
    );
};

const customContext = createContext({ contextProperty: "fanta" });

const ContextConsumerTest = () => {
    const {
        data: { contextProperty },
    } = useContext(customContext);
    return <span>Context data: {contextProperty}</span>;
};

const ContextUpdaterTest = ({ text }) => {
    const { set } = useContext(customContext);
    return <button onClick={() => set({ contextProperty: Math.random() * 1000 })}>{text}</button>;
};

const CustomBoundElement = ({ text }) => {
    const { data } = useContext(customContext);
    return (
        <div>
            custom element generator with prop {text}, from context {JSON.stringify(data)}
        </div>
    );
};

createCustomElement(
    "slask-elm",
    CustomBoundElement,
    <style>
        {`
    * {
            background-color:blue;
            padding:1rem;
            color:#fff;
    }
			`}
    </style>
);

hydrate(
    <div>
        <div>
            <p>Custom elements with bound context</p>
            <slask-elm text="text from property" />
        </div>
        <div>
            <p>Regular context consumer</p>
            <ContextConsumerTest />
        </div>
        <div>
            <p>State hooks</p>
            <BindingTest />
        </div>
        <div>
            <p>Context updater</p>
            <ContextUpdaterTest text="change context value" />
        </div>
    </div>
);
