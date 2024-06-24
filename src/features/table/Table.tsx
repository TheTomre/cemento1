import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TableData } from "../../types";
import { RootState } from "../../store/store";
import {
    updateCell,
    setData,
    setSortColumn,
    setSearchQuery,
    deleteRow,
} from "../../features/table/dataSlice";
import {
    toggleColumnVisibility,
    setVisibleColumns,
} from "../../features/table/visibleColumnsSlice";
import { Button, IconButton, TextField } from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";

function Table(props: { tableData: TableData }) {
    const { tableData } = props;
    const dispatch = useAppDispatch();
    const { data, sortColumn, sortOrder, searchQuery } = useAppSelector(
        (state: RootState) => state.data
    );
    const visibleColumns = useAppSelector(
        (state: RootState) => state.visibleColumns
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [editRowId, setEditRowId] = useState<string | null>(null);
    const [editRowData, setEditRowData] = useState<any>({});
    const rowsPerPage = 10;

    useEffect(() => {
        if (data.length === 0) {
            dispatch(setData(tableData.data));
        }
        if (visibleColumns.length === 0) {
            dispatch(setVisibleColumns(tableData.columns.map((col) => col.id)));
        }
    }, [
        dispatch,
        data.length,
        visibleColumns.length,
        tableData.data,
        tableData.columns,
    ]);

    const handleInputChange = useCallback(
        (
            event: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >,
            rowId: string,
            columnId: string
        ) => {
            let value: any;
            if (event.target.type === "checkbox") {
                value = (event.target as HTMLInputElement).checked;
            } else {
                value = event.target.value;
            }
            setEditRowData((prev: Record<string, any>) => ({
                ...prev,
                [columnId]: value,
            }));
        },
        []
    );

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleSort = useCallback(
        (columnId: string) => {
            dispatch(setSortColumn(columnId));
        },
        [dispatch]
    );

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setSearchQuery(event.target.value));
        },
        [dispatch]
    );

    const handleEdit = (rowId: string) => {
        setEditRowId(rowId);
        const rowData = data.find((row) => row.id === rowId);
        if (rowData) setEditRowData(rowData);
    };

    const handleCancelEdit = () => {
        setEditRowId(null);
        setEditRowData({});
    };

    const handleSaveEdit = () => {
        Object.keys(editRowData).forEach((columnId) => {
            dispatch(
                updateCell({
                    rowId: editRowId!,
                    columnId,
                    value: editRowData[columnId],
                })
            );
        });
        setEditRowId(null);
        setEditRowData({});
    };

    const handleDelete = (rowId: string) => {
        dispatch(deleteRow(rowId));
    };

    const getSortedData = useCallback(() => {
        let sortedData = [...data];
        if (sortColumn) {
            sortedData.sort((a, b) => {
                if (a[sortColumn] < b[sortColumn])
                    return sortOrder === "asc" ? -1 : 1;
                if (a[sortColumn] > b[sortColumn])
                    return sortOrder === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortedData;
    }, [data, sortColumn, sortOrder]);

    const getFilteredData = useCallback(() => {
        if (!searchQuery) return getSortedData();
        return getSortedData().filter((row) =>
            Object.values(row).some((value) =>
                value
                    .toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
        );
    }, [getSortedData, searchQuery]);

    const renderHeader = () => {
        return (
            <tr>
                {tableData.columns.map((column) =>
                    visibleColumns.includes(column.id) ? (
                        <th
                            key={column.id}
                            style={{ width: column.width }}
                            onClick={() => handleSort(column.id)}
                            className="cursor-pointer"
                        >
                            {column.title}{" "}
                            {sortColumn === column.id
                                ? sortOrder === "asc"
                                    ? "↑"
                                    : "↓"
                                : ""}
                        </th>
                    ) : null
                )}
                <th>Actions</th>
            </tr>
        );
    };

    const renderInput = (
        columnType: string,
        columnId: string,
        value: any,
        rowId: string
    ) => {
        switch (columnType) {
            case "number":
                return (
                    <TextField
                        type="number"
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                rowId,
                                columnId
                            )
                        }
                    />
                );
            case "boolean":
                return (
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                rowId,
                                columnId
                            )
                        }
                        className="form-checkbox"
                    />
                );
            case "date":
                return (
                    <TextField
                        type="date"
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                rowId,
                                columnId
                            )
                        }
                    />
                );
            case "select":
                const column = tableData.columns.find(
                    (col) => col.id === columnId
                );
                return (
                    <TextField
                        select
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as unknown as React.ChangeEvent<HTMLSelectElement>,
                                rowId,
                                columnId
                            )
                        }
                        SelectProps={{
                            native: true,
                        }}
                    >
                        {column?.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </TextField>
                );
            default:
                return (
                    <TextField
                        type="text"
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                rowId,
                                columnId
                            )
                        }
                    />
                );
        }
    };

    const renderRows = () => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageRows = getFilteredData().slice(start, end);
        return pageRows.map((row) => (
            <tr key={row.id} className="border-b">
                {tableData.columns.map((column) =>
                    visibleColumns.includes(column.id) ? (
                        <td key={column.id} className="p-2">
                            {editRowId === row.id
                                ? renderInput(
                                      column.type,
                                      column.id,
                                      editRowData[column.id],
                                      row.id
                                  )
                                : row[column.id]}
                        </td>
                    ) : null
                )}
                <td className="p-2">
                    {editRowId === row.id ? (
                        <>
                            <IconButton
                                onClick={handleSaveEdit}
                                color="primary"
                            >
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
                </td>
            </tr>
        ));
    };

    const renderColumnVisibilityControls = () => {
        return tableData.columns.map((column) => (
            <label key={column.id} className="mr-4">
                <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.id)}
                    onChange={() => dispatch(toggleColumnVisibility(column.id))}
                    className="form-checkbox"
                />
                {column.title}
            </label>
        ));
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);
        return (
            <div className="flex justify-center mt-4">
                <Button
                    onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            fontWeight:
                                currentPage === index + 1 ? "bold" : "normal",
                        }}
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button
                    onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="mb-4">{renderColumnVisibilityControls()}</div>
            <TextField
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                fullWidth
                className="mb-4"
            />
            <table className="min-w-full bg-white border border-gray-300">
                <thead>{renderHeader()}</thead>
                <tbody>{renderRows()}</tbody>
            </table>
            {renderPagination()}
        </div>
    );
}

export default Table;
