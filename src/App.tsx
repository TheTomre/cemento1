import { Provider } from "react-redux";
import CustomTable from "./features/table/Table";
import { store } from "./store/store";
import { mockData } from "./mock/mockData";

const sampleData = mockData(100);

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <CustomTable tableData={sampleData} />
            </div>
        </Provider>
    );
}

export default App;
