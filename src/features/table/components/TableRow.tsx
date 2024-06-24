import React from "react";
import { TableRow, TableCell, IconButton } from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { TableRowProps } from "../../../types";

const TableRowComponent: React.FC<TableRowProps> = ({
    row,
    columns,
    visibleColumns,
    editRowId,
    editRowData,
    handleEdit,
    handleDelete,
    handleSaveEdit,
    handleCancelEdit,
    renderInput,
}) => {
    return (
        <TableRow key={row.id}>
            {columns.map((column) =>
                visibleColumns.includes(column.id) ? (
                    <TableCell key={column.id} style={{ padding: "12px" }}>
                        {editRowId === row.id
                            ? renderInput(
                                  column.type,
                                  column.id,
                                  editRowData[column.id],
                                  row.id
                              )
                            : column.type === "boolean"
                            ? row[column.id]
                                ? "Yes"
                                : "No"
                            : row[column.id] !== undefined
                            ? row[column.id]
                            : null}
                    </TableCell>
                ) : null
            )}
            <TableCell style={{ padding: "12px" }}>
                {editRowId === row.id ? (
                    <>
                        <IconButton onClick={handleSaveEdit} color="primary">
                            <Save />
                        </IconButton>
                        <IconButton
                            onClick={handleCancelEdit}
                            color="secondary"
                        >
                            <Cancel />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <IconButton
                            onClick={() => handleEdit(row.id)}
                            color="primary"
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDelete(row.id)}
                            color="secondary"
                        >
                            <Delete />
                        </IconButton>
                    </>
                )}
            </TableCell>
        </TableRow>
    );
};

export default TableRowComponent;
