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
        {true}
        {false}
        {null}
        {undefined}
        {0}
        {""}
        {[]}
        {{}}
        {'"><script>alert(document.cookie)</script>'}
        <div class="klass">klass</div>
        <a href="http://feber.se">slaskadasdasdasd</a>
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
        <div>
            här ska det vara svg
            <svg
                width="67"
                height="38"
                xmlns="http://www.w3.org/2000/svg"
                id="Energy_class_A"
                data-name="Energy class A"
                viewBox="0 0 101.7805 57.5694"
            >
                <defs>
                    <style>{`.cls-1{fill:#fff;}.cls-2{fill:#06a64f;}.cls-3{fill:none;stroke:#231f20;stroke-linejoin:round;stroke-width:0.82px;}.cls-4{isolation:isolate;}.cls-5{fill:#010101;}.cls-6{fill:#231d1e;}.cls-7{fill:#211f11;}`}</style>
                </defs>
                <rect
                    onClick={() => console.log("vit")}
                    class="cls-1"
                    x="79.3057"
                    y="0.8294"
                    width="21.6438"
                    height="55.92"
                ></rect>
                <polygon
                    onClick={() => console.log("pelle")}
                    class="cls-2"
                    points="22.971 0.829 79.38 0.829 79.38 56.749 22.971 56.749 0.261 28.789 22.971 0.829"
                ></polygon>
                <path
                    onClick={() => console.log("kalle")}
                    class="cls-3"
                    d="M23.6052.4194h77.43a.41.41,0,0,1,.41.41h0v55.92a.41.41,0,0,1-.41.41h-77.43a.4093.4093,0,0,1-.3-.13l-22.71-28a.41.41,0,0,1,0-.56l22.71-28A.41.41,0,0,1,23.6052.4194Z"
                    transform="translate(-0.0747 0)"
                ></path>
                <g class="cls-4">
                    <path
                        class="cls-1"
                        d="M65.1648,43.0859a9.5275,9.5275,0,0,1,.3536,1.4527.9286.9286,0,0,1-.1879.8039,1.4818,1.4818,0,0,1-.9218.3314c-.441.042-1.0454.063-1.8179.063-.8016,0-1.4282-.0129-1.8762-.0374a4.2872,4.2872,0,0,1-1.0268-.154.9216.9216,0,0,1-.4948-.3185,1.7787,1.7787,0,0,1-.2368-.5356l-2.0536-6.6275H45.431l-1.9358,6.45a2.1514,2.1514,0,0,1-.2479.5985,1.0146,1.0146,0,0,1-.4953.3816,3.3827,3.3827,0,0,1-.9679.1913q-.6258.0525-1.6406.0514a14.4613,14.4613,0,0,1-1.7-.077,1.2431,1.2431,0,0,1-.85-.3687,1.0577,1.0577,0,0,1-.1651-.8285,8.846,8.846,0,0,1,.3541-1.4282l9.418-29.2662a2.6487,2.6487,0,0,1,.3308-.7007,1.161,1.161,0,0,1,.6021-.4078,4.4051,4.4051,0,0,1,1.1447-.1785q.7316-.0385,1.9357-.0385,1.3923,0,2.2187.0385A5.4831,5.4831,0,0,1,54.72,12.66a1.2134,1.2134,0,0,1,.661.4207,2.5406,2.5406,0,0,1,.3418.7642ZM51.1431,18.8924H51.12L46.8,32.9135h8.6625Z"
                        transform="translate(-0.0747 0)"
                    ></path>
                </g>
                <path
                    class="cls-5"
                    d="M62.6468,46.0671h-1.875A4.5962,4.5962,0,0,1,59.6586,45.9a1.24,1.24,0,0,1-.6534-.43,2.0894,2.0894,0,0,1-.2976-.6558l-1.9812-6.4047H45.7133l-1.868,6.2379a2.4864,2.4864,0,0,1-.2836.6709,1.3484,1.3484,0,0,1-.6511.5157,3.72,3.72,0,0,1-1.0618.21H40.1966a16.063,16.063,0,0,1-1.7286-.0724,1.504,1.504,0,0,1-1.0461-.4679,1.379,1.379,0,0,1-.2468-1.1085,8.8918,8.8918,0,0,1,.3682-1.47L46.8487,13.563a2.9632,2.9632,0,0,1,.3728-.7853,1.52,1.52,0,0,1,.77-.5338,4.6493,4.6493,0,0,1,1.2823-.1926h4.1609a5.6626,5.6626,0,0,1,1.3716.19,1.51,1.51,0,0,1,.8243.5269,2.8657,2.8657,0,0,1,.4026.8722l9.4839,29.3613a10.1613,10.1613,0,0,1,.37,1.5028,1.2459,1.2459,0,0,1-.26,1.0548,1.7928,1.7928,0,0,1-1.161.4481A15.2138,15.2138,0,0,1,62.6468,46.0671Zm-17.4049-8.29H57.1931l2.1236,6.8656a1.48,1.48,0,0,0,.2007.4551.609.609,0,0,0,.3081.1925,4.0458,4.0458,0,0,0,.9556.1447h1.8657a15.1747,15.1747,0,0,0,1.7748-.0572,1.1911,1.1911,0,0,0,.76-.2637.6334.6334,0,0,0,.084-.4877,9.562,9.562,0,0,0-.35-1.4282L55.423,13.8109a2.2077,2.2077,0,0,0-.3027-.6686.8771.8771,0,0,0-.4685-.287,5.0489,5.0489,0,0,0-1.2223-.17H49.2768a3.9891,3.9891,0,0,0-1.1044.1657.8746.8746,0,0,0-.4393.2987,2.3854,2.3854,0,0,0-.28.6015L38.1442,43.1232a8.4875,8.4875,0,0,0-.3472,1.3885.7469.7469,0,0,0,.1132.5916.8906.8906,0,0,0,.5939.2369,15.6212,15.6212,0,0,0,1.6878.0711h1.6412a3.0784,3.0784,0,0,0,.8617-.1738.7026.7026,0,0,0,.3354-.2637,1.8477,1.8477,0,0,0,.2048-.4959Zm10.6537-4.6136h-9.52l4.74-15.4294Zm-8.6636-.6324h7.8048L51.1181,19.8819Z"
                    transform="translate(-0.0747 0)"
                ></path>
                <g class="cls-4">
                    <path
                        class="cls-6"
                        d="M96.5219,17.4088a3.8361,3.8361,0,0,1,.1621.6172.3739.3739,0,0,1-.0869.3409.71.71,0,0,1-.4219.1406q-.3032.0264-.833.0263c-.3682,0-.6543-.0048-.86-.0156a2.0677,2.0677,0,0,1-.4707-.0654.427.427,0,0,1-.2276-.1348.7359.7359,0,0,1-.1074-.2275l-.9414-2.8135h-5.26l-.8867,2.7383a.885.885,0,0,1-.1133.2539.462.462,0,0,1-.2275.1621,1.6561,1.6561,0,0,1-.4434.0811q-.2871.0219-.7519.0214a7.2515,7.2515,0,0,1-.7793-.0322.5942.5942,0,0,1-.39-.1562.4245.4245,0,0,1-.0761-.3526,3.497,3.497,0,0,1,.163-.6054L88.2875,4.9655a1.1008,1.1008,0,0,1,.1514-.2979.54.54,0,0,1,.2764-.1728,2.1886,2.1886,0,0,1,.5234-.0752c.2246-.0108.52-.0166.8887-.0166q.6372,0,1.0166.0166a2.7269,2.7269,0,0,1,.5888.0752.5685.5685,0,0,1,.3037.1787,1.033,1.033,0,0,1,.1573.3242ZM90.0942,7.14h-.0108l-1.98,5.9512h3.9707Z"
                        transform="translate(-0.0747 0)"
                    ></path>
                </g>
                <path
                    class="cls-7"
                    d="M94.1906,25.2941l-3.16-3.16a1.1122,1.1122,0,0,0-1.57,0l-3.16,3.16a1.11,1.11,0,0,0,1.57,1.57L89.1349,25.6v9.3a1.11,1.11,0,0,0,2.2207,0V25.6L92.62,26.8644a1.11,1.11,0,0,0,1.57-1.57Z"
                    transform="translate(-0.0747 0)"
                ></path>
                <g class="cls-4">
                    <path
                        class="cls-5"
                        d="M95.7077,41.339a5.1649,5.1649,0,0,1-.0245.5332,1.7488,1.7488,0,0,1-.0693.3574.4085.4085,0,0,1-.1084.1866.2349.2349,0,0,1-.1533.0537.9186.9186,0,0,1-.4151-.1924,6.0869,6.0869,0,0,0-.76-.416,7.7581,7.7581,0,0,0-1.1319-.416,5.46,5.46,0,0,0-1.5263-.1914,3.963,3.963,0,0,0-1.6787.3457,3.6578,3.6578,0,0,0-1.2842.9824,4.4718,4.4718,0,0,0-.82,1.5254,6.39,6.39,0,0,0-.2862,1.9678,6.7511,6.7511,0,0,0,.292,2.0859,4.2833,4.2833,0,0,0,.8145,1.5088,3.34,3.34,0,0,0,1.26.9179,4.132,4.132,0,0,0,1.625.31,3.559,3.559,0,0,0,.8593-.1064,2.999,2.999,0,0,0,.7891-.32V47.27H90.67c-.1182,0-.211-.0791-.2764-.2393a2.3815,2.3815,0,0,1-.0986-.8164,4.004,4.004,0,0,1,.0254-.501,1.3321,1.3321,0,0,1,.0732-.3261.4745.4745,0,0,1,.1182-.1807.24.24,0,0,1,.1582-.0586H94.986a.6536.6536,0,0,1,.2822.0586.6207.6207,0,0,1,.2178.1758.8435.8435,0,0,1,.1426.2822,1.3256,1.3256,0,0,1,.0488.3789v5.4942a1.3839,1.3839,0,0,1-.1035.56.7581.7581,0,0,1-.4239.3789c-.2148.0918-.48.1885-.7949.2871s-.6445.1856-.9834.2569a9.7876,9.7876,0,0,1-1.0273.1591,10.0039,10.0039,0,0,1-1.042.0547,7.4541,7.4541,0,0,1-2.7412-.4756,5.4942,5.4942,0,0,1-2.05-1.3759,6.0652,6.0652,0,0,1-1.2842-2.1973,9.05,9.05,0,0,1-.4443-2.9394A9.1433,9.1433,0,0,1,85.2575,43.2,6.5374,6.5374,0,0,1,86.6,40.9064a5.7791,5.7791,0,0,1,2.0987-1.4453,7.21,7.21,0,0,1,2.7422-.501,8.5378,8.5378,0,0,1,1.5107.1221,8.0828,8.0828,0,0,1,1.19.2988,4.47,4.47,0,0,1,.8438.3789,2.11,2.11,0,0,1,.47.3516.9112.9112,0,0,1,.1924.4219A4.0335,4.0335,0,0,1,95.7077,41.339Z"
                        transform="translate(-0.0747 0)"
                    ></path>
                </g>
            </svg>
        </div>
        <div>
            As text: {htmlString}
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <a href="/docs/Web/SVG/Element/circle">
                    <circle cx="50" cy="40" r="35" />
                </a>

                <a href="/docs/Web/SVG/Element/text">
                    <text x="50" y="90" text-anchor="middle">
                        &lt;circle&gt;
                    </text>
                </a>
            </svg>
        </div>
        <div innerHTML={htmlString + " < innerHTML"}></div>
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
    <Fragment>
        <div ref="falafel">Refs when root is Fragment with strange values</div>
        {true}
        {false}
        {null}
        {undefined}
        {0}
        {""}
        {[]}
        {{}}
    </Fragment>
);

const refs = getRefs(html);

const refs2 = getRefs(html2);
console.log("refs:", refs);
console.log("refs2:", refs2);

html.style.color = "DarkOrchid";

document.body.append(html, ...html2);
