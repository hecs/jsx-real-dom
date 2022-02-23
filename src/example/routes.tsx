import { createActiveElement } from "../lib/createCustomElement";
import { h, Fragment } from "../lib/createelement";
import { useRouter } from "../lib/hooks/useRouter";

const RouteOne = () => {
    return (
        <div>
            ett
            <>
                <h1>hej</h1>
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

const Route = ({ match, element }) => {
    const { path } = useRouter(match);
    //console.log(match, path);
    const renderedElement = element({});
    return path.includes(match) ? renderedElement : undefined;
};

createActiveElement(
    "route-test",
    () => (
        <div>
            <header>
                <h1>Slaskar</h1>
            </header>
            <Route match="/apa" element={RouteOne} />
            <a href="#/apa">first</a> | <a href="#/apa/pelle">second</a>
        </div>
    ),
    []
);
