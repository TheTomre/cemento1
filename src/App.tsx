import { Provider } from "react-redux";
import CustomTable from "./features/table/Table";
import { store } from "./store/store";
import { mockData } from "./mock/mockData";

const sampleData = mockData(100);

function App() {
    return (
        <Provider store={store}>
            <div className="min-h-screen bg-gray-100 text-gray-900">
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="">
                        <h1 className="text-xl font-semibold">
                            React Table + Tailwind CSS = ❤
                        </h1>
                    </div>
                    <div className="mt-4">
                        <CustomTable tableData={sampleData} />
                    </div>
                </main>
            </div>
        </Provider>
    );
}

export default App;
