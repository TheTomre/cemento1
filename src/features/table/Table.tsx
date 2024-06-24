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
import {
    Button,
    IconButton,
    TextField,
    Checkbox,
    MenuItem,
    Select,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    Paper,
    Toolbar,
    InputAdornment,
    FormGroup,
    FormControlLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { Edit, Delete, Save, Cancel, Search } from "@mui/icons-material";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

function CustomTable(props: { tableData: TableData }) {
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
    const [open, setOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<string | null>(null);
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
            _: string,
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
        setRowToDelete(rowId);
        setOpen(true);
    };

    const confirmDelete = () => {
        if (rowToDelete) {
            dispatch(deleteRow(rowToDelete));
        }
        setOpen(false);
        setRowToDelete(null);
    };

    const cancelDelete = () => {
        setOpen(false);
        setRowToDelete(null);
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
            <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                {tableData.columns.map((column) =>
                    visibleColumns.includes(column.id) ? (
                        <TableCell
                            key={column.id}
                            style={{
                                fontWeight: "bold",
                                padding: "12px",
                            }}
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
                        size="small"
                        style={{ marginTop: "8px", width: "80px" }}
                    />
                );
            case "boolean":
                return (
                    <Checkbox
                        checked={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as React.ChangeEvent<HTMLInputElement>,
                                rowId,
                                columnId
                            )
                        }
                        size="small"
                        style={{ marginTop: "8px" }}
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
                        size="small"
                        style={{ marginTop: "8px", width: "150px" }}
                    />
                );
            case "select":
                const column = tableData.columns.find(
                    (col) => col.id === columnId
                );
                return (
                    <Select
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                e as unknown as React.ChangeEvent<HTMLSelectElement>,
                                rowId,
                                columnId
                            )
                        }
                        size="small"
                        style={{ marginTop: "8px", width: "100px" }}
                    >
                        {column?.options?.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
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
                        size="small"
                        style={{ marginTop: "8px", width: "150px" }}
                    />
                );
        }
    };

    const renderRows = () => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageRows = getFilteredData().slice(start, end);
        return pageRows.map((row) => (
            <TableRow key={row.id}>
                {tableData.columns.map((column) =>
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
                </TableCell>
            </TableRow>
        ));
    };

    const renderColumnVisibilityControls = () => {
        return (
            <FormGroup row>
                {tableData.columns.map((column) => (
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

    const renderPagination = () => {
        const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);
        const maxPages = 5;
        const pageNumbers = [];

        if (totalPages <= maxPages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pageNumbers.push(1, 2, 3, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(
                    1,
                    "...",
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                pageNumbers.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }

        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "16px",
                }}
            >
                <Button
                    onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                >
                    <ChevronLeftIcon
                        style={{ width: "20px", height: "20px" }}
                    />
                </Button>
                {pageNumbers.map((page, index) => (
                    <Button
                        key={index}
                        onClick={() =>
                            typeof page === "number" && handlePageChange(page)
                        }
                        style={{
                            fontWeight:
                                currentPage === page ? "bold" : "normal",
                            backgroundColor:
                                currentPage === page
                                    ? "#5f64f5"
                                    : "transparent",
                            color: currentPage === page ? "white" : "black",
                        }}
                        disabled={typeof page !== "number"}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                >
                    <ChevronRightIcon
                        style={{ width: "20px", height: "20px" }}
                    />
                </Button>
            </div>
        );
    };

    return (
        <Paper style={{ padding: "24px" }}>
            <Toolbar
                style={{
                    marginBottom: "16px",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex" }}>
                    {renderColumnVisibilityControls()}
                </div>
                <TextField
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    style={{ width: "300px" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Toolbar>
            <TableContainer>
                <Table
                    style={{
                        minWidth: "100%",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                    }}
                >
                    <TableHead>{renderHeader()}</TableHead>
                    <TableBody>{renderRows()}</TableBody>
                </Table>
            </TableContainer>
            {renderPagination()}
            <Dialog
                open={open}
                onClose={cancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Delete"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this row?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        style={{ color: "red" }}
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default CustomTable;
