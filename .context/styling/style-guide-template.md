# Style Guide

## UI Framework

**MUI v5** (Material UI) with Emotion. Custom theme defined in `src/theme.ts`.

## Theme

```typescript
// src/theme.ts
palette: {
  primary:    { main: '#024caa' }   // deep blue
  secondary:  { main: '#ec8305' }   // orange
  background: { default: '#dbd3d3' } // warm grey
  text:       { primary: 'rgb(9, 16, 87)' } // dark navy
}
```

Always use theme colors via MUI's `sx` prop or `useTheme` — never hardcode hex colors
in component files. The exception is the existing `style.css` which predates this rule.

## Styling Approach

### Use `sx` prop — not `className` or inline `style`

```tsx
// ✅ preferred
<Box sx={{ display: 'flex', p: 1, backgroundColor: 'background.paper' }}>

// ✅ acceptable for single trivial overrides
<div style={{ paddingRight: '5px' }}>

// ❌ avoid new className usage — prefer sx
<div className="my-new-class">
```

### Theme-dependent styles use callback form

```tsx
<Card sx={(theme) => ({
  backgroundColor: i % 4 === 0
    ? theme.palette.primary.light
    : theme.palette.background.paper
})}>
```

### MUI spacing shorthand

Use MUI spacing tokens (numbers map to `8px` units):
- `p: 1` = 8px padding, `p: 2` = 16px, etc.
- Mix with explicit values for precision: `sx={{ p: 0, paddingLeft: '8px' }}`

## Component Sizing

The popup has a fixed-width side drawer (135px). Main content area uses `flexGrow: 1`.
Components should fill available height: `height: "calc(100% - Xpx)"` for scrollable areas.

Scrollable table/list containers:
```tsx
<TableContainer sx={{ overflow: "auto", height: "calc(100% - 35px)" }}>
```

## Typography

Use MUI `Typography` or `primaryTypographyProps` on `ListItemText`:
```tsx
<ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }} />
```

For small annotations (dates, metadata): `variant="body2"` or `fontSize: 'small'`.

## Icons

Use `@mui/icons-material` — import individually to avoid bundle bloat:
```typescript
import { ExpandMore, Add, Delete } from "@mui/icons-material";
// NOT: import * as Icons from "@mui/icons-material"
```

## Layout Patterns

The popup uses a permanent drawer + main content box:
```tsx
<Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
  <Drawer variant="permanent" sx={{ width: 135 }}>...</Drawer>
  <Box component="main" sx={{ flexGrow: 1, p: 1, height: '100%', overflow: 'auto' }}>
    {/* page content */}
  </Box>
</Box>
```

For two-column grids on the Home page:
```tsx
<Paper sx={{ display: 'grid', gridTemplateColumns: "50% 50%" }}>
```
