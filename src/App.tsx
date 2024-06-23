import React from "react";
import { Provider } from "react-redux";
import Table from "./features/table/Table";
import { TableData } from "./types";
import { store } from "./store/store";

const sampleData: TableData = {
    columns: [
        { id: "name", ordinalNo: 1, title: "Name", type: "string" },
        { id: "age", ordinalNo: 2, title: "Age", type: "number" },
        { id: "isActive", ordinalNo: 3, title: "Active", type: "boolean" },
    ],
    data: [
        { id: "1", name: "John Doe", age: 30, isActive: true },
        { id: "2", name: "Jane Smith", age: 25, isActive: false },
    ],
};

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <Table tableData={sampleData} />
            </div>
        </Provider>
    );
}

export default App;
