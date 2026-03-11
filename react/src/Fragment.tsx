import {
	Children,
	Fragment as ReactFragment,
	cloneElement,
	isValidElement,
	type CSSProperties,
	type ReactElement,
} from 'react';
import type { FragmentProps } from './types';

type FragmentChildProps = {
	className?: string;
	style?: CSSProperties;
	'data-fragment-index'?: number;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
	return classNames.filter(Boolean).join(' ');
}

function mergeStyles(
	childStyle: CSSProperties | undefined,
	style: CSSProperties | undefined
) {
	if (!childStyle) return style;
	if (!style) return childStyle;

	return {
		...childStyle,
		...style,
	};
}

export function Fragment({
	animation,
	index,
	as,
	asChild,
	className,
	style,
	children,
}: FragmentProps) {
	const classes = mergeClassNames('fragment', animation, className);

	if (asChild) {
		let child: ReactElement<FragmentChildProps>;
		try {
			child = Children.only(children) as ReactElement<FragmentChildProps>;
		} catch {
			throw new Error('Fragment with asChild expects exactly one React element child.');
		}

		if (!isValidElement(child) || child.type === ReactFragment) {
			throw new Error('Fragment with asChild expects exactly one non-Fragment React element child.');
		}

		const fragmentChildProps: FragmentChildProps = {
			className: mergeClassNames(child.props.className, classes),
			style: mergeStyles(child.props.style, style),
		};

		if (index !== undefined) {
			fragmentChildProps['data-fragment-index'] = index;
		}

		return cloneElement(child, fragmentChildProps);
	}

	const Tag = as ?? 'span';

	return (
		<Tag className={classes} style={style} data-fragment-index={index}>
			{children}
		</Tag>
	);
}
