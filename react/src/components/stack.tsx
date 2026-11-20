import type { StackProps } from '../types';

export function Stack({ className, style, children }: StackProps) {
	return (
		<section className={className} style={style}>
			{children}
		</section>
	);
}
