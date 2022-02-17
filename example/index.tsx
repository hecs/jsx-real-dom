import { h, Fragment, useState } from "../lib/createelement";
import { getRefs } from "../lib/getRefs";
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
    return (
        <div>
            <input value={data} onChange={updateValue} /> data in input {data} {idx}
        </div>
    );
};

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
        <ce-app>
            <div class="insideslot">Inside slot</div>
        </ce-app>
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
