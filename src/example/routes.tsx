import { createActiveElement } from "../lib/createCustomElement";
import { h, Fragment } from "../lib/createelement";
import { contextName } from "../lib/hooks/hooks";
import { useRouter } from "../lib/hooks/useRouter";
import { useState } from "../lib/hooks/useState";

const RouteOne = () => {
    const [t, st] = useState(1);
    return (
        <div>
            ett
            <>
                <h1 onClick={() => st(t + 1)}>hej {t}</h1>
                <div>
                    <Route match="/apa/pelle" element={RouteTwo} />
                </div>
            </>
        </div>
    );
};

const RouteTwo = () => {
    return <div>två</div>;
};

function Route({ match, element }) {
    const matchLocation = () => (window.location.hash.includes(match) ? "block" : "none");
    const locationChange = (elm) => (e) => {
        return (elm.style.display = matchLocation());
    };

    let display = matchLocation();
    const setParent = (elm) => {
        console.log("add listener");
        const eventHandler = locationChange(elm);
        window.addEventListener("popstate", eventHandler);
        return () => {
            console.log("remove listener");
            window.removeEventListener("popstate", eventHandler);
        };
    };
    const renderedElement = element({});
    return (
        <div ref={setParent} style={{ display }}>
            {renderedElement}
        </div>
    );
}

createActiveElement(
    "route-test",
    () => (
        <div>
            <header>
                <h1>Slaskar</h1>
            </header>
            <Route match="/apa" element={RouteOne}></Route>
            <a href="#/apa">first</a> | <a href="#/apa/pelle">second</a>
        </div>
    ),
    []
);
