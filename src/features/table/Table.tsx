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
import { setVisibleColumns } from "../../features/table/visibleColumnsSlice";
import {
    TextField,
    Paper,
    Toolbar,
    InputAdornment,
    Checkbox,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableContainer,
    TableHead,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import TableHeader from "./components/TableHeader";
import TableRowComponent from "./components/TableRow";
import ColumnVisibilityControls from "./components/ColumnVisibilityControls";
import PaginationControls from "./components/PaginationControls";
import TableEditDialog from "./components/TableEditDialog";

const CustomTable = ({ tableData }: { tableData: TableData }) => {
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

    return (
        <Paper style={{ padding: "24px" }}>
            <Toolbar
                style={{
                    marginBottom: "16px",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex" }}>
                    <ColumnVisibilityControls
                        columns={tableData.columns}
                        visibleColumns={visibleColumns}
                    />
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
                    <TableHead>
                        <TableHeader
                            columns={tableData.columns}
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            visibleColumns={visibleColumns}
                            handleSort={handleSort}
                        />
                    </TableHead>
                    <TableBody>
                        {getFilteredData()
                            .slice(
                                (currentPage - 1) * rowsPerPage,
                                currentPage * rowsPerPage
                            )
                            .map((row) => (
                                <TableRowComponent
                                    key={row.id}
                                    row={row}
                                    columns={tableData.columns}
                                    visibleColumns={visibleColumns}
                                    editRowId={editRowId}
                                    editRowData={editRowData}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    handleSaveEdit={handleSaveEdit}
                                    handleCancelEdit={handleCancelEdit}
                                    handleInputChange={handleInputChange}
                                    renderInput={renderInput}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <PaginationControls
                currentPage={currentPage}
                totalPages={Math.ceil(getFilteredData().length / rowsPerPage)}
                handlePageChange={handlePageChange}
            />
            <TableEditDialog
                open={open}
                cancelDelete={cancelDelete}
                confirmDelete={confirmDelete}
            />
        </Paper>
    );
};

export default CustomTable;
