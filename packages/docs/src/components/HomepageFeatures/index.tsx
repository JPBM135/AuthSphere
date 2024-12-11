import Heading from '@theme/Heading';
import clsx from 'clsx';
import type { JSX } from 'react';
import authentication from '../../../static/img/authentication.svg';
import cyber_attack from '../../../static/img/cyber-attack.svg';
import fingerprint from '../../../static/img/fingerprint.svg';
import styles from './styles.module.css';

interface FeatureItem {
	Svg: React.ComponentType<React.ComponentProps<'svg'>>;
	description: JSX.Element;
	title: string;
}

const FeatureList: FeatureItem[] = [
	{
		title: 'Secure',
		Svg: fingerprint,
		description: (
			<>
				Keep your data secure with AuthSphere. We provide the tools to keep your data safe and
				secure.
			</>
		),
	},
	{
		title: 'Protect your data',
		Svg: cyber_attack,
		description: (
			<>
				We provide secure token and session management to protect your data from unauthorized
				access.
			</>
		),
	},
	{
		title: 'Easy to use',
		Svg: authentication,
		description: (
			<>
				AuthSphere is easy to use. We provide a simple API to manage your users and their
				authentication.
			</>
		),
	},
];

function Feature({ title, Svg, description }: FeatureItem) {
	return (
		<div className={clsx('col col--4')}>
			<div className="text--center">
				<Svg className={styles.featureSvg} role="img" />
			</div>
			<div className="text--center padding-horiz--md">
				<Heading as="h3">{title}</Heading>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures(): JSX.Element {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
