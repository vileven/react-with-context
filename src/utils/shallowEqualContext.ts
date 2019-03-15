import * as shallowCompare from 'react-addons-shallow-compare';

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
	// SameValue algorithm
	if (x === y) {
		// Steps 1-5, 7-10
		// Steps 6.b-6.e: +0 != -0
		// Added the nonzero y check to make Flow happy, but it is redundant
		return x !== 0 || y !== 0 || 1 / x === 1 / y;
	} else {
		// Step 6.a: NaN == NaN
		return x !== x && y !== y;
	}
}

function compareContextSubs(context, nextContext, contextSubs) {
	return contextSubs.some((name) => !is(context[name], nextContext[name]));
}

export function shallowEqualContext(instance, nextProps, nextState, contextSubs) {
	const contextComparison = compareContextSubs(instance.props.context, nextProps.context, contextSubs);

	const withoutContextProps = {...instance.props};
	delete withoutContextProps.context;
	const fakeInstance = {props: withoutContextProps, state: instance.state} as React.Component<any, any>;

	const withoutContextNextProps = {...nextProps};
	delete withoutContextNextProps.context;

	const originCompare = shallowCompare(fakeInstance, withoutContextNextProps, nextState);

	return originCompare || contextComparison;
}
