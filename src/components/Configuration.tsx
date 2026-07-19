import React, { FC, useEffect, useState } from "react";
import "../style.css";
import {
Box, Typography, List, ListItem, ListItemText,
IconButton, TextField, Select, MenuItem, FormControl,
InputLabel, InputAdornment, Chip, Divider, Button, Stack,
} from "@mui/material";
import { Loading } from "./Loading";
import { Add, Delete, Edit, Check, Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { useConfiguration, useConfigurationDispatch } from "./ConfigurationContext";
import { PATEntry, Platform } from "../lib/models/pat-entry";

type PatFormState = { label: string; token: string; platform: Platform };
const emptyForm = (): PatFormState => ({ label: '', token: '', platform: 'github' });

export const Configuration: FC = () => {
const [loading, setLoading] = useState(false);
const [configError, setConfigError] = useState<string | null>(null);
const [editingId, setEditingId] = useState<string | null>(null);
const [editForm, setEditForm] = useState<PatFormState>(emptyForm());
const [newPat, setNewPat] = useState<PatFormState>(emptyForm());
const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
const [showNewToken, setShowNewToken] = useState(false);

const configs = useConfiguration();
const dispatchConfig = useConfigurationDispatch();

const setStorage = (items: { [key: string]: any }) => {
if (chrome.storage) {
chrome.storage.sync.set(items)
}
}

useEffect(() => {
setStorage({ 'configs': configs });
}, [configs]);

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

const handleAdd = () => {
if (loading) return;
if (!newPat.label.trim() || !newPat.token.trim()) {
modifyErrorState('Label and token are required.', 'config');
return;
}
const entry: PATEntry = {
id: crypto.randomUUID(),
label: newPat.label.trim(),
token: newPat.token.trim(),
platform: newPat.platform,
};
dispatchConfig?.({ type: 'add-token', token: entry });
setNewPat(emptyForm());
setShowNewToken(false);
};

const handleDelete = (id: string) => {
if (loading) return;
dispatchConfig?.({ type: 'delete-token', id });
};

const startEdit = (entry: PATEntry) => {
setEditingId(entry.id);
setEditForm({ label: entry.label, token: entry.token, platform: entry.platform });
};

const handleUpdate = () => {
if (!editingId) return;
if (!editForm.label.trim() || !editForm.token.trim()) {
modifyErrorState('Label and token are required.', 'config');
return;
}
dispatchConfig?.({ type: 'update-token', token: { id: editingId, ...editForm } });
setEditingId(null);
};

const toggleShowToken = (id: string) =>
setShowTokens(prev => ({ ...prev, [id]: !prev[id] }));

const tokens = configs?.tokens ?? [];

return (
<>
<Loading isLoading={loading} />
{configError && (
<Box sx={{ color: 'error.main', fontSize: '0.85rem', mb: 1 }}>{configError}</Box>
)}
<Box sx={{ px: 1, overflow: 'auto', height: '100%' }}>
<Typography variant="subtitle1" fontWeight="medium" gutterBottom>
Personal Access Tokens
</Typography>

{tokens.length === 0 && (
<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
No tokens configured. Add one below.
</Typography>
)}

<List dense disablePadding>
{tokens.map(entry =>
editingId === entry.id ? (
/* ── Edit row ── */
<ListItem key={entry.id} disableGutters
sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, py: 1 }}
>
<Stack direction="row" spacing={1}>
<TextField
label="Label" size="small" value={editForm.label}
onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))}
sx={{ flex: 2 }}
/>
<FormControl size="small" sx={{ flex: 1 }}>
<InputLabel>Platform</InputLabel>
<Select
label="Platform" value={editForm.platform}
onChange={e => setEditForm(f => ({ ...f, platform: e.target.value as Platform }))}
>
<MenuItem value="github">GitHub</MenuItem>
<MenuItem value="gitlab">GitLab</MenuItem>
</Select>
</FormControl>
</Stack>
<Stack direction="row" spacing={1} alignItems="center">
<TextField
label="Token" size="small" value={editForm.token}
type={showTokens[entry.id] ? 'text' : 'password'}
onChange={e => setEditForm(f => ({ ...f, token: e.target.value }))}
sx={{ flex: 1 }}
InputProps={{
endAdornment: (
<InputAdornment position="end">
<IconButton size="small" onClick={() => toggleShowToken(entry.id)}>
{showTokens[entry.id] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
</IconButton>
</InputAdornment>
),
}}
/>
<IconButton size="small" color="primary" onClick={handleUpdate}>
<Check />
</IconButton>
<IconButton size="small" onClick={() => setEditingId(null)}>
<Close />
</IconButton>
</Stack>
</ListItem>
) : (
/* ── Display row ── */
<ListItem key={entry.id} disableGutters
secondaryAction={
<Stack direction="row">
<IconButton size="small" onClick={() => toggleShowToken(entry.id)}>
{showTokens[entry.id] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
</IconButton>
<IconButton size="small" onClick={() => startEdit(entry)}>
<Edit fontSize="small" />
</IconButton>
<IconButton size="small" onClick={() => handleDelete(entry.id)}>
<Delete fontSize="small" />
</IconButton>
</Stack>
}
>
<ListItemText
primary={
<Stack direction="row" spacing={1} alignItems="center">
<span>{entry.label}</span>
<Chip label={entry.platform} size="small" variant="outlined" />
</Stack>
}
secondary={showTokens[entry.id] ? entry.token : '••••••••••••'}
secondaryTypographyProps={{ fontSize: '0.7rem', fontFamily: 'monospace' }}
/>
</ListItem>
)
)}
</List>

<Divider sx={{ my: 1 }} />

<Typography variant="subtitle2" gutterBottom>Add New Token</Typography>
<Stack spacing={1}>
<Stack direction="row" spacing={1}>
<TextField
label="Label" size="small" value={newPat.label}
onChange={e => setNewPat(f => ({ ...f, label: e.target.value }))}
placeholder="e.g. Personal GitHub"
sx={{ flex: 2 }}
/>
<FormControl size="small" sx={{ flex: 1 }}>
<InputLabel>Platform</InputLabel>
<Select
label="Platform" value={newPat.platform}
onChange={e => setNewPat(f => ({ ...f, platform: e.target.value as Platform }))}
>
<MenuItem value="github">GitHub</MenuItem>
<MenuItem value="gitlab">GitLab</MenuItem>
</Select>
</FormControl>
</Stack>
<TextField
label="Token" size="small" value={newPat.token}
type={showNewToken ? 'text' : 'password'}
onChange={e => setNewPat(f => ({ ...f, token: e.target.value }))}
InputProps={{
endAdornment: (
<InputAdornment position="end">
<IconButton size="small" onClick={() => setShowNewToken(s => !s)}>
{showNewToken ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
</IconButton>
</InputAdornment>
),
}}
/>
<Button
variant="outlined" size="small" startIcon={<Add />}
onClick={handleAdd} disabled={loading}
sx={{ alignSelf: 'flex-start' }}
>
Add Token
</Button>
</Stack>
</Box>
</>
);
};
