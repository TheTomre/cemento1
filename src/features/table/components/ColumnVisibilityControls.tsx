import React from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";
import { toggleColumnVisibility } from "../../../features/table/visibleColumnsSlice";
import { ColumnVisibilityControlsProps } from "../../../types";

const ColumnVisibilityControls: React.FC<ColumnVisibilityControlsProps> = ({
    columns,
    visibleColumns,
}) => {
    const dispatch = useAppDispatch();
    return (
        <FormGroup row>
            {columns.map((column) => (
                <FormControlLabel
                    key={column.id}
                    control={
                        <Checkbox
                            checked={visibleColumns.includes(column.id)}
                            onChange={() =>
                                dispatch(toggleColumnVisibility(column.id))
                            }
                        />
                    }
                    label={column.title}
                />
            ))}
        </FormGroup>
    );
};

export default ColumnVisibilityControls;
