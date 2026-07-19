import { createTheme, ThemeOptions } from '@mui/material';

export const themeOptions: ThemeOptions = {
	palette: {
		primary: {
			main: '#024caa',
		},
		secondary: {
			main: '#ec8305',
		},
		background: {
			default: '#dbd3d3',
		},
		text: {
			primary: 'rgb(9, 16, 87)',
		},
	},
};

export const theTheme = createTheme(themeOptions);