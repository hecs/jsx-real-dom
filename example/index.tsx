import { createContext, useContext } from "../lib/createContext";
import { createCustomElement } from "../lib/createCustomElement";
import { h, Fragment } from "../lib/createelement";
import { getRefs } from "../lib/getRefs";
import { useEffect } from "../lib/useEffect";
import { useState } from "../lib/useState";
import "./did-app";

console.log("hello and welcome");

function clickHandler(e) {
    console.log("click", e);
}

const items = [
    { planet: "Mercury", size: 2.44 },
    { planet: "Venus", size: 6.052 },
    { planet: "Earth", size: 6.371 },
    { planet: "Mars", size: 3.39 },
    { planet: "Jupiter", size: 69.911 },
    { planet: "Saturn", size: 58.232 },
    { planet: "Uranus", size: 25.362 },
    { planet: "Neptune", size: 24.622 },
] as const;

const htmlString = "<b>I'm bold</b>";

const TestComponent = ({ items }: any) => {
    const elms = items.map((data, idx) => {
        return <span>{idx} i komponent</span>;
    });
    return <div>{elms}</div>;
};

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

const customContext = createContext({ pelle: "fant" });

const ContextConsumerTest = () => {
    const {
        data: { pelle },
    } = useContext(customContext);
    return <span>Context data: {pelle}</span>;
};

const ContextUpdaterTest = ({ text }) => {
    const { set } = useContext(customContext);
    return <button onClick={() => set({ pelle: Math.random() * 1000 })}>{text}</button>;
};

const CustomBoundElement = ({ text }) => {
    const { data } = useContext(customContext);
    return (
        <div>
            custom element generator with prop {text}, from context {JSON.stringify(data)}
        </div>
    );
};

createCustomElement("slask-elm", CustomBoundElement, () => (
    <style>
        {`
            * {
                background-color:blue;
            }
        `}
    </style>
));

const html = (
    <div ref="kebab">
        <span>Hello and welcome to the example page.</span>
        <p>
            <b>T</b>est
        </p>
        <span style="color: green">Style as string</span>
        <span style={{ color: "red" }}>Style as object</span>
        <div onMouseMove={console.log}>
            This has onMouseMove event <br />
            Buttons
            {":"}
            <button ref="pizza" disabled textContent="Disabled knapp…" />
            <button ref="clickButton" textContent="Click knapp…" onClick={(e) => clickHandler(e)} />
        </div>
        <ContextConsumerTest />

        <ce-app>
            <div class="insideslot">Inside slot</div>
        </ce-app>
        <slask-elm text="text from property" />
        {false}
        {null}
        {undefined}
        {0}
        {""}
        {[]}
        {{}}
        {'"><script>alert(document.cookie)</script>'}
        <TestComponent items={items} />
        <BindingTest />
        <div class="klass">klass</div>
        <div className="klassname">klassname</div>
        <ul>
            {items.map((i, index) => (
                <li ref="listItems">
                    Name: <span ref={`planet${index}`}>{i.planet}</span>
                    <br></br>
                    Size: {i.size}
                </li>
            ))}
        </ul>
        <div>As text: {htmlString}</div>
        <div dangerouslySetInnerHTML={{ __html: htmlString + " < dangerouslySetInnerHTML" }}></div>
        <label for="korv">Label attribute "for"</label>
        <input id="korv" />
        <label htmlFor="korv2">Label property "htmlFor"</label>
        <input id="korv2" />
        <Fragment>
            <div>Inside fragment</div>
        </Fragment>
        <Fragment>
            <Fragment>
                <Fragment>
                    <div>
                        <Fragment>
                            <ContextUpdaterTest text="change context value" />
                            <Fragment>Inside multiple fragment</Fragment>
                        </Fragment>
                    </div>
                </Fragment>
            </Fragment>
        </Fragment>

        <button disabled={false}>Boolean attributes (disabled=false)</button>
        <button disabled={true}>Boolean attributes (disabled=true)</button>
    </div>
);

const refs = getRefs(html);
console.log("refs:", refs);
html.style.color = "DarkOrchid";
document.body.append(html);
