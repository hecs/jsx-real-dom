import { h, Fragment } from "../lib/createelement";
import { getRefs } from "../lib/getRefs";
import { hydrate } from "../lib/hydrate";
import { useTranslations } from "../lib/utils/translate";

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

const t = useTranslations({
    key1: "translated text",
    key2: "other translated text, {{age}} years old",
});

const testar = "hej";

const valueObject = { age: 12 };

const someText = t`key2${valueObject}`;

console.log(t("key2", valueObject));

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

        <div class="klass">
            klass
            <ul>
                <li>
                    <span>{someText}</span>
                </li>
            </ul>
        </div>
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
        <input
            id="korv"
            data-plupp="testar"
            onChange={(e) => {
                console.log(e.target.dataset);
            }}
        />
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
                            <>Inside multiple </>
                        </>
                    </div>
                </>
            </>
        </>

        <button disabled={false}>Boolean attributes (disabled=false)</button>
        <button disabled={true}>Boolean attributes (disabled=true)</button>
    </div>
);

const html2 = (
    <>
        <div ref="a">1</div>
        <div ref="b">2</div>
        <div ref="c">3</div>
    </>
);

const refs = getRefs(html);
const refs2 = getRefs(html2);
console.log(refs2, html2);
console.log("refs:", refs);
console.log("refs2:", refs2);
html.style.color = "DarkOrchid";
hydrate(html);
