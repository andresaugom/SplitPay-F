import React, { useEffect, useState } from "react";
import {
Box,
TextField,
InputAdornment,
Typography,
Paper,
FormHelperText,
} from "@mui/material";

type SPAmountProps = {
value?: number | null;
onChange?: (value: number | null) => void;
label?: string;
currencySymbol?: string;
placeholder?: string;
min?: number;
max?: number;
required?: boolean;
};

const formatMoney = (value: number | null, currencySymbol = "$") => {
if (value === null || isNaN(value)) return "";
// Localized formatting with two decimals
return (
    currencySymbol +
    value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
);
};

const parseToNumber = (raw: string) => {
if (!raw) return null;
// Remove currency symbol, spaces and thousands separators (commas)
const cleaned = raw.replace(/[^\d.-]/g, "");
if (cleaned === "" || cleaned === "." || cleaned === "-") return null;
const n = Number(cleaned);
return Number.isFinite(n) ? n : null;
};

const validateMoney = (
raw: string,
{ min, max, required }: { min?: number; max?: number; required?: boolean }
) => {
if (!raw || raw.trim() === "") {
    if (required) return "Amount is required";
    return null;
}

// Allow digits, optional one decimal point, up to 2 decimals
const cleaned = raw.replace(/[^\d.-]/g, "");
// Reject multiple dots or multiple minus signs
if ((cleaned.match(/\./g) || []).length > 1) return "Invalid amount format";
if ((cleaned.match(/-/g) || []).length > 1) return "Invalid amount format";

// Regex to validate typical money formats: optional leading -, digits, optional . and up to 2 decimals
if (!/^-?\d+(\.\d{0,2})?$/.test(cleaned)) {
    return "Use a numeric amount, up to 2 decimal places";
}

const n = Number(cleaned);
if (!isFinite(n)) return "Invalid amount";

if (min !== undefined && n < min) return `Minimum is ${min}`;
if (max !== undefined && n > max) return `Maximum is ${max}`;

return null;
};

const SPAmount: React.FC<SPAmountProps> = ({
value = null,
onChange,
label = "Amount",
currencySymbol = "$",
placeholder = "0.00",
min,
max,
required = false,
}) => {
const [display, setDisplay] = useState<string>(
    value !== null && value !== undefined ? formatMoney(value, currencySymbol) : ""
);
const [error, setError] = useState<string | null>(null);
const [touched, setTouched] = useState(false);

useEffect(() => {
    // Keep display in sync when external value changes
    if (value === null || value === undefined) {
        setDisplay("");
    } else {
        setDisplay(formatMoney(value, currencySymbol));
    }
}, [value, currencySymbol]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Keep whatever user types, but run quick client-side filter to allowed chars
    // Allow digits, dots, commas, currency symbol and spaces while typing
    setDisplay(raw);
    if (!touched) setTouched(true);

    const validation = validateMoney(raw, { min, max, required });
    setError(validation);

    const parsed = parseToNumber(raw);
    if (onChange) onChange(parsed);
};

const handleBlur = () => {
    setTouched(true);
    const validation = validateMoney(display, { min, max, required });
    setError(validation);

    const parsed = parseToNumber(display);
    // If valid number, format nicely; else keep raw for correction
    if (parsed !== null && validation === null) {
        setDisplay(formatMoney(parsed, currencySymbol));
    }
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // On focus, show plain numeric representation to allow easy editing
    const parsed = parseToNumber(display);
    if (parsed !== null) {
        // Keep up to 2 decimals
        setDisplay(parsed.toString());
    } else {
        // Remove currency symbol to let user type
        const raw = display.replace(new RegExp(`\\${currencySymbol}`, "g"), "");
        setDisplay(raw);
    }
    (e.target as HTMLInputElement).select();
};

return (
    <Paper
        elevation={3}
        sx={{
            p: 2,
            borderRadius: 2,
            background:
                "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,255,0.95))",
        }}
    >
        <Box display="flex" alignItems="center" gap={2} flexDirection="column">
            <Box width="100%" display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {label}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Box
                        component="span"
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 24,
                            height: 24,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            borderRadius: "50%",
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        {currencySymbol}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {currencySymbol} — two decimals allowed
                    </Typography>
                </Box>

            <TextField
                fullWidth
                variant="outlined"
                value={display}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                error={!!error && touched}
                helperText={touched && error ? error : "Enter the amount to split"}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">{currencySymbol}</InputAdornment>
                    ),
                    sx: {
                        borderRadius: 2,
                        bgcolor: "background.paper",
                    },
                    inputMode: "decimal",
                }}
            />

            {min !== undefined || max !== undefined ? (
                <FormHelperText sx={{ mt: 1 }}>
                    {min !== undefined ? `Min: ${min}` : ""}
                    {min !== undefined && max !== undefined ? " • " : ""}
                    {max !== undefined ? `Max: ${max}` : ""}
                </FormHelperText>
            ) : null}
        </Box>
        </Box>
        </Box>
    </Paper>
);
};

export default SPAmount;