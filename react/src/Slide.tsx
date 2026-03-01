import type { SlideProps } from './types';

export function Slide({ children, ...rest }: SlideProps) {
	return <section {...rest}>{children}</section>;
}
