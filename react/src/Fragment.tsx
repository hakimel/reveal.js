import type { FragmentProps } from './types';

export function Fragment({
	animation,
	index,
	as: Tag = 'span',
	className,
	style,
	children,
}: FragmentProps) {
	const classes = ['fragment', animation, className].filter(Boolean).join(' ');

	return (
		<Tag className={classes} style={style} data-fragment-index={index}>
			{children}
		</Tag>
	);
}
