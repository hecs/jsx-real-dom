import { h, Fragment } from "../src/lib/createelement";
import { getRefs } from "../src/lib/getRefs";
import "./did-app";
import { svgFrag } from "./svg";

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

const html = (
    <div ref="kebab">
        <h1>Hello and welcome to the example page.</h1>
        <p>
            <b>T</b>est
        </p>
        <span style="color: green">Style as string</span>
        <span style={{ color: "red" }}>Style as object</span>
        <div
            onMouseMove={(ev: MouseEvent) => {
                refs.mousepos.textContent = JSON.stringify({ x: ev.offsetX, y: ev.offsetY });
            }}
            style={{ padding: "20px", border: "1px dashed #ccc", position: "relative" }}
        >
            This has onMouseMove event <br />
            Position: <code ref="mousepos"></code>
            <br />
            Buttons
            {":"}
            <button ref="pizza" disabled textContent="Disabled knapp…" />
            <button ref="clickButton" textContent="Click knapp…" onClick={(e) => clickHandler(e)} />
        </div>
        <ce-app>
            <div class="insideslot">Inside slot</div>
        </ce-app>
        <hr />
        <h3>Primitives:</h3>
        {true}
        {false}
        {null}
        {undefined}
        {0}
        {Number(1)}
        {new Number(2)}
        {""}
        {[]}
        {{}}
        {String("Hello")}
        {"_"}
        {new String("world")}
        <hr />
        {'"><script>alert(document.cookie)</script>'}
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
        <div innerHTML={htmlString + " < innerHTML"}></div>
        <div textContent={htmlString + " < textContent"}></div>
        <label for="korv">Label attribute "for"</label>
        <input id="korv" />
        <label htmlFor="korv2">Label property "htmlFor"</label>
        <input id="korv2" />
        <>
            <div>Inside fragment</div>
        </>
        <>
            <>
                <>
                    <div>
                        <>
                            <>Inside multiple fragment</>
                        </>
                    </div>
                </>
            </>
        </>
        <button disabled={false}>Boolean attributes (disabled=false)</button>
        <button disabled={true}>Boolean attributes (disabled=true)</button>
        <br />
        Datalist
        <input list="pommes" />
        <datalist id="pommes">
            <option value="potatis1" />
            <option value="potatis2" />
            <option value="potatis3" />
            <option value="potatis4" />
        </datalist>
    </div>
);

const html2 = (
    <div ref="falafel" undef={undefined} nil={null} zero={0} empty-string={""}>
        Refs when root is Fragment
    </div>
);

const refs = getRefs(html);

const refs2 = getRefs(html2);
console.log("refs:", refs);
console.log("refs2:", refs2);

document.body.append(html, html2, <h2>SVGs</h2>, ...svgFrag());
