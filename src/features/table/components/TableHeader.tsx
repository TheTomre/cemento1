import React from "react";
import { TableRow, TableCell, TableSortLabel } from "@mui/material";
import { TableHeaderProps } from "../../../types";

const TableHeader: React.FC<TableHeaderProps> = ({
    columns,
    sortColumn,
    sortOrder,
    visibleColumns,
    handleSort,
}) => {
    return (
        <TableRow style={{ backgroundColor: "#f0f0f0" }}>
            {columns.map((column) =>
                visibleColumns.includes(column.id) ? (
                    <TableCell
                        key={column.id}
                        style={{ fontWeight: "bold", padding: "12px" }}
                        sortDirection={
                            sortColumn === column.id ? sortOrder : false
                        }
                    >
                        <TableSortLabel
                            active={sortColumn === column.id}
                            direction={
                                sortColumn === column.id ? sortOrder : "asc"
                            }
                            onClick={() => handleSort(column.id)}
                        >
                            {column.title}
                        </TableSortLabel>
                    </TableCell>
                ) : null
            )}
            <TableCell style={{ fontWeight: "bold", padding: "12px" }}>
                Actions
            </TableCell>
        </TableRow>
    );
};

export default TableHeader;
