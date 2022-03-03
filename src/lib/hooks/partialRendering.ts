import { getOrCreateHook } from "./hooks";

function partialRendering(fn) {
    return getOrCreateHook((ctx) => {
        let oldRender = ctx.render;
        ctx.render = (props) => {
            if (fn(ctx.element, props, ctx.props)) {
                ctx.props = props || ctx.props;
                oldRender(props);
            } else {
                ctx.props = props || ctx.props;
            }
        };
        return () => {};
    });
}

export default partialRendering;
