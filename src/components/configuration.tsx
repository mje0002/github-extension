import React, { FC, useEffect, useState } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { RepoSchema } from "../lib/models/repo";
import { Checkbox } from "@mui/material";

export const Configuration = () => {

	return (
		<Box>
			<label>Configure PAT</label>

			<input></input>
			<button>Add</button>

			<input></input>
			<button>Update</button>

			<button>Delete</button>
		</Box>);
};

