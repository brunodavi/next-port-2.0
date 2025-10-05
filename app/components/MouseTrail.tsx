'use client';

import { useCallback, useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

export default function MouseTrail() {
	const [init, setInit] = useState(false);
	const [isDark, setIsDark] = useState(false);

	// Detecta o tema atual
	useEffect(() => {
		const checkTheme = () => {
			setIsDark(document.documentElement.classList.contains('dark'));
		};

		checkTheme();

		// Observa mudanças no tema
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		initParticlesEngine(async (engine: Engine) => {
			await loadSlim(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	const particlesLoaded = useCallback(async (container: any) => {
		console.log('Particles loaded', container);
	}, []);

	// Configuração minimalista e tech
	const options: ISourceOptions = {
		background: {
			color: {
				value: 'transparent',
			},
		},
		fpsLimit: 120,
		interactivity: {
			events: {
				onHover: {
					enable: true,
					mode: ['grab', 'bubble'],
				},
				resize: {
					enable: true,
				},
			},
			modes: {
				grab: {
					distance: 140,
					links: {
						blink: false,
						consent: false,
						opacity: 0.5,
					},
				},
				bubble: {
					distance: 200,
					size: 6,
					duration: 2,
					opacity: 0.8,
				},
			},
		},
		particles: {
			color: {
				value: isDark ? '#60a5fa' : '#3b82f6', // blue-400 dark / blue-500 light
			},
			links: {
				color: isDark ? '#60a5fa' : '#3b82f6',
				distance: 150,
				enable: true,
				opacity: isDark ? 0.3 : 0.2,
				width: 1,
			},
			move: {
				direction: 'none',
				enable: true,
				outModes: {
					default: 'bounce',
				},
				random: false,
				speed: 1,
				straight: false,
			},
			number: {
				density: {
					enable: true,
				},
				value: 80,
			},
			opacity: {
				value: isDark ? 0.5 : 0.3,
			},
			shape: {
				type: 'circle',
			},
			size: {
				value: { min: 1, max: 3 },
			},
		},
		detectRetina: true,
	};

	if (!init) return null;

	return (
		<Particles
			id="tsparticles"
			particlesLoaded={particlesLoaded}
			options={options}
			className="fixed inset-0 pointer-events-none z-0"
		/>
	);
}
