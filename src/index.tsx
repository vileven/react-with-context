import * as React from 'react';
import {shallowEqualContext} from './utils/shallowEqualContext';

export type NotWrappedComponentClassLike<TProps = {}> = React.ComponentClass<TProps> | React.StatelessComponent<TProps>;

export interface WrapperComponentClass<TProps = {}> {
	NakedComponent?: NotWrappedComponentClassLike<TProps>;
}

export interface WithContextProps<TProps = {}> {
	context?: Partial<TProps>;
}

export function withContextGenerator<T extends WithContextProps<T>>(Context: React.Context<any>):
	(contextSubsOrClass?: string[] | React.ComponentClass<T>) => any {

	return function withContext(
		contextSubsOrClass?: string[] | React.ComponentClass<T>,
	) {

		const decorator = (contextSubs: string[], ComponentClass: React.ComponentClass<T>) => {
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

		if (!contextSubsOrClass || Array.isArray(contextSubsOrClass)) {
			return decorator.bind(null, contextSubsOrClass);
		}

		return decorator.call(null, null, contextSubsOrClass);
	}
}

export default withContextGenerator;
