import {useState} from 'react'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Home from "./components/Home.jsx";
import GlobalStyles from "./style/GlobalStyles.js";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0
        }

    }
});

function App() {
    const [count, setCount] = useState(0)

    return (
        <QueryClientProvider client={queryClient}>
            <GlobalStyles/>
            <Home/>
        </QueryClientProvider>
    )
}

export default App
