import inject from '@rollup/plugin-inject'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker'

export default defineConfig({
	publicDir: 'public',
	server: { port: 3000 },
	build: {
		outDir: 'build',
		rollupOptions: {
			plugins: [inject({ Buffer: ['buffer', 'Buffer'], process: 'process' })]
		}
	},
	plugins: [react(), eslint(), svgr(), tsconfigPaths(), checker({ typescript: true })]
})
