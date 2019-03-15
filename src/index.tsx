import * as React from 'react';
import {shallowEqualContext} from '@/utils/shallowEqualContext';

export type NotWrappedComponentClassLike<TProps = {}> = React.ComponentClass<TProps> | React.FunctionComponent<TProps>;

export interface WrapperComponentClass<TProps = {}> {
	NakedComponent?: NotWrappedComponentClassLike<TProps>;
}

export interface WithContextProps<TProps = {}> {
	context?: Partial<TProps>;
}

const withContextGenerator = (Context: React.Context<any>) => function withContext<T extends WithContextProps<T>>(
	contextSubs: string[] | null,
) {
	return (ComponentClass: React.ComponentClass<T>) => {
		const ModifiedComponentClass = class extends ComponentClass {
			shouldComponentUpdate(nextProps: Readonly<T>, nextState: Readonly<{}>, nextContext): boolean {
				if (!contextSubs) {
					return super.shouldComponentUpdate(nextProps, nextState, nextContext);
				}

				return shallowEqualContext(this, nextProps, nextState, contextSubs);
			}
		};

		return class WithContextComponent extends React.PureComponent<T> {

			static NakedComponent = (ComponentClass as WrapperComponentClass).NakedComponent || ComponentClass;

			render() {
				const {props} = this;

				return (
					<Context.Consumer>
						{(context) => <ModifiedComponentClass context={{...context}} {...props}/>}
					</Context.Consumer>
				);
			}
		} as any;
	};
};

export default withContextGenerator;
