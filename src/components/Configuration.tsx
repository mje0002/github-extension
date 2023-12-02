import React, { FC, useEffect, useState } from "react";
import "../style.css";
import { Box, InputLabel, Input, InputAdornment, IconButton } from "@mui/material";
import { Loading } from "./Loading";
import { Add, Delete, Update, Visibility, VisibilityOff } from "@mui/icons-material";
import { useConfiguration, useConfigurationDispatch } from "./ConfigurationContext";

export const Configuration: FC = () => {
	const [loading, setLoading] = useState(false);
	const [configerror, setConfigError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = React.useState(false);

	const configs = useConfiguration();
	const dispatchConfig = useConfigurationDispatch();


	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const setStorage = (items: { [key: string]: any }) => {
		if (chrome.storage) {
			chrome.storage.sync.set(items)
		}
	}

	function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
		func: F,
		waitFor: number,
	): (...args: Parameters<F>) => void {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: Parameters<F>): void => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				console.log('debounce')
				func(...args)
			}, waitFor);
		};
	}

	const modifyErrorState = (errorMessage: string | null, type: string) => {
		const errorFunc = setConfigError;
		errorFunc(errorMessage);
		if (errorMessage) {
			debounce(errorFunc, 2000)(null);
		}
	}

	useEffect(() => {
		setStorage({ 'configs': configs });
	}, [configs])

	const handleConfig = async (action: 'update' | 'add' | 'delete', field: any, value: any) => {
		if (loading) return;
		setLoading(true);
		try {
			if (dispatchConfig) {
				if (!value && ['update', 'add'].includes(action)) { throw new Error(`Invalid Value. Please provide ${field} with the correct value.`); }
				dispatchConfig({ type: action, field: field, value: value });
				modifyErrorState(null, 'config');
			}
		} catch (error) {
			if (error instanceof Error)
				modifyErrorState(error.message, 'config');
		} finally {
			setLoading(false);
		}
	}


	return (
		<>
			<Loading isLoading={loading}></Loading>
			{configerror && <div style={{ color: 'red' }}>{configerror}</div>}
			<Box paddingRight="5px">

				{/* <TextField id="pat" label="Personal Access Token" variant="standard" /> */}
				<InputLabel htmlFor="standard-adornment-password">Personal Access Token</InputLabel>
				<Input
					id="standard-adornment-password"
					type={showPassword ? 'text' : 'password'}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								onMouseDown={handleMouseDownPassword}
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
				/>
				<IconButton aria-label="add" onClick={async (e) => {
					e.preventDefault();
					const v = document.getElementById('standard-adornment-password') as HTMLInputElement;
					if (v) {
						await handleConfig("add", 'personal_access_token', v.value);
						v.value = "";
					}
				}}>
					<Add />
				</IconButton>

				<IconButton aria-label="update" onClick={async (e) => {
					e.preventDefault();
					const v = document.getElementById('standard-adornment-password') as HTMLInputElement;
					if (v) {
						await handleConfig("update", 'personal_access_token', v.value);
						v.value = "";
					}
				}}>
					<Update />
				</IconButton>

				<IconButton aria-label="delete" onClick={
					async (e) => {
						e.preventDefault();
						await handleConfig("delete", 'personal_access_token', undefined)
					}}>
					<Delete />
				</IconButton>
			</Box>
		</>
	);
};

