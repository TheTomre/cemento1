import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { TableData } from "../../types";
import { RootState } from "../../store/store";
import { updateCell, setData } from "../../features/table/dataSlice";
import {
    toggleColumnVisibility,
    setVisibleColumns,
} from "../../features/table/visibleColumnsSlice";

function Table(props: { tableData: TableData }) {
    const { tableData } = props;
    const dispatch = useAppDispatch();
    const data = useAppSelector((state: RootState) => state.data);
    const visibleColumns = useAppSelector(
        (state: RootState) => state.visibleColumns
    );

    useEffect(() => {
        if (!data.length) {
            dispatch(setData(tableData.data));
        }
        if (!visibleColumns.length) {
            dispatch(setVisibleColumns(tableData.columns.map((col) => col.id)));
        }
    }, [
        dispatch,
        data.length,
        visibleColumns.length,
        tableData.data,
        tableData.columns,
    ]);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        rowId: string,
        columnId: string
    ) => {
        dispatch(updateCell({ rowId, columnId, value: event.target.value }));
    };

    const renderHeader = () => {
        return (
            <tr>
                {tableData.columns.map((column) =>
                    visibleColumns.includes(column.id) ? (
                        <th key={column.id} style={{ width: column.width }}>
                            {column.title}
                        </th>
                    ) : null
                )}
            </tr>
        );
    };

    const renderRows = () => {
        return data.map((row) => (
            <tr key={row.id}>
                {tableData.columns.map((column) =>
                    visibleColumns.includes(column.id) ? (
                        <td key={column.id}>
                            <input
                                type={
                                    column.type === "number" ? "number" : "text"
                                }
                                value={row[column.id]}
                                onChange={(e) =>
                                    handleInputChange(e, row.id, column.id)
                                }
                            />
                        </td>
                    ) : null
                )}
            </tr>
        ));
    };

    const renderColumnVisibilityControls = () => {
        return tableData.columns.map((column) => (
            <label key={column.id} style={{ marginRight: "10px" }}>
                <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.id)}
                    onChange={() => dispatch(toggleColumnVisibility(column.id))}
                />
                {column.title}
            </label>
        ));
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                {renderColumnVisibilityControls()}
            </div>
            <table>
                <thead>{renderHeader()}</thead>
                <tbody>{renderRows()}</tbody>
            </table>
        </div>
    );
}

export default Table;
