type NodeDict = {
    [key: string]: { node: HTMLElement; idx: number };
};

const toDomDict = (nodes: Node[], keyExtractor: (Node) => string | undefined): NodeDict => {
    return nodes.reduce((acc, node, idx) => {
        const key = keyExtractor(node);
        return key
            ? {
                  ...acc,
                  [key]: { node, idx },
              }
            : acc;
    }, {});
};

type Child = { [key: string]: any; key: string };

export const conditionalMerge = (
    render: (Child) => HTMLElement,
    children: Child[],
    parentNode: HTMLElement,
    keyExtractor: (Node) => string | undefined
) => {
    const existing = toDomDict(
        Array.from(parentNode.childNodes).filter((d) => d.nodeType === 1),
        keyExtractor
    );

    let matched: string[] = [];
    children.forEach((node, idx) => {
        const key = node.key || keyExtractor(node);
        if (key) {
            const found = existing[key];
            if (found) {
                matched.push(key);
                if (found.idx !== idx) {
                    parentNode.append(found.node);
                }
            } else {
                parentNode.appendChild(render(node));
            }
        }
    });
    Object.keys(existing)
        .filter((key) => !matched.includes(key))
        .forEach((keyToRemove) => {
            parentNode.removeChild(existing[keyToRemove].node);
        });
};

export const mergeChildren = (
    children: Node[],
    parentNode: HTMLElement,
    keyExtractor: (Node) => string | undefined
) => {
    const nodeData = children.reduce((all, child) => {
        const key = keyExtractor(child);
        return key ? { ...all, [key]: child } : all;
    }, {});
    const nodes = Object.entries(nodeData).map(([key, value]) => {
        return { key };
    });
    return conditionalMerge(({ key }) => nodeData[key], nodes, parentNode, keyExtractor);
    // const existing = toDomDict(
    //     Array.from(parentNode.childNodes).filter((d) => d.nodeType === 1),
    //     keyExtractor
    // );

    // let matched: string[] = [];
    // children.forEach((node, idx) => {
    //     const key = keyExtractor(node);
    //     if (key) {
    //         const found = existing[key];
    //         if (found) {
    //             matched.push(key);
    //             if (found.idx !== idx) {
    //                 parentNode.append(found.node);
    //             }
    //         } else {
    //             parentNode.appendChild(node);
    //         }
    //     }
    // });
    // Object.keys(existing)
    //     .filter((key) => !matched.includes(key))
    //     .forEach((keyToRemove) => {
    //         parentNode.removeChild(existing[keyToRemove].node);
    //     });
};
