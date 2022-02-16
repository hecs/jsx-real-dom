import { h, getRefs, Fragment } from "./lib/createelement";
import "./did-app";

console.log("hello and welcome");

function clickHandler(e) {
    console.log("click", e);
}

const items = [
    { planet: "Mercury", sizeKm: 2.44 },
    { planet: "Venus", sizeKm: 6.052 },
    { planet: "Earth", sizeKm: 6.371 },
    { planet: "Mars", sizeKm: 3.39 },
    { planet: "Jupiter", sizeKm: 69.911 },
    { planet: "Saturn", sizeKm: 58.232 },
    { planet: "Uranus", sizeKm: 25.362 },
    { planet: "Neptune", sizeKm: 24.622 },
] as const;

const htmlString = "<b>I'm bold</b>";

const html = (
    <div ref="kebab">
        <span>Hello and welcome to the example page.</span>
        <p>
            <b>T</b>est
        </p>
        <span style="color: green">Kebab</span>
        <span style={{ color: "red" }}>Pizza</span>
        <div onMouseMove={console.log}>
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
        <div class="klass">klass</div>
        <div className="klassname">klassname</div>
        <ul>
            {items.map((i, index) => (
                <li ref="listItems">
                    Name: <span ref={`planet${index}`}>{i.planet}</span>
                    <br></br>
                    Age: {i.sizeKm}
                </li>
            ))}
        </ul>
        <div>{htmlString}</div>
        <div dangerouslySetInnerHTML={{ __html: htmlString + " < dangerouslySetInnerHTML" }}></div>
        <label for="korv">Korv typ</label>
        <input id="korv" />
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
