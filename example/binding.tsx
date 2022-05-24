import { useQuery } from "../src";
import { createCustomElement } from "../src/lib/createCustomElement";
import { h, Fragment } from "../src/lib/createelement";
import { useState } from "../src/lib/hooks/useState";
import { hydrate } from "../src/lib/hydrate";

const fetchData = () =>
    fetch("https://swapi.dev/api/films/", {
        headers: { "Content-Type": "application/json" },
    }).then((d) => d.json());

const App = () => {
    const [count, setCount] = useState(0);
    const { isLoading, data } = useQuery(fetchData, ["static"], { enabled: true });
    console.log(isLoading, data);
    return (
        <div>
            <p>
                <button
                    type="button"
                    onClick={() => {
                        console.log("update", count + 1);
                        setCount(count + 1);
                    }}
                >
                    count is: {count}
                </button>
            </p>
            <p>
                {isLoading && <div>Loading...</div>}
                {!isLoading &&
                    data.results.map(({ title }) => {
                        return (
                            <div>
                                <span>{title}</span>
                            </div>
                        );
                    })}
            </p>
            <p>
                <a
                    class="link"
                    href="https://preactjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn luffar-act
                </a>
            </p>
        </div>
    );
};

hydrate(
    <div id="app">
        <img src="logo.svg" className="App-logo" width="200" height="200" alt="logo" />
        <p>Hello esbuild + Luffar act!</p>
        <App />
    </div>
);

// createCustomElement(
//     "slask-elm",
//     () => (
//         <div id="app">
//             <img src="logo.svg" className="App-logo" alt="logo" />
//             <p>Hello esbuild + Luffar act!</p>
//             <App />
//         </div>
//     ),
//     <style>
//         {`

//     * {
//       box-sizing: border-box;
//     }

//     #app {
//       height: 100%;
//       text-align: center;
//       background-color: #673ab8;
//       color: #fff;
//       font-size: 1.5em;
//       padding-top: 100px;
//     }

// .App-logo {
//     width: 40vmin;
//     pointer-events: none;
//   }

//     .link {
//       color: #fff;
//     }

// 			`}
//     </style>
// );
