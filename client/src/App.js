import logo from './logo.svg';
import './App.css';
import TestCreation from 'src/pages/TestCreation'
import { TestCreationDataProvider } from 'src/contexts/test-creation-context';


function App() {
  return (
      <div className="App">
        <header className="App-header">
        <TestCreationDataProvider>
          <TestCreation/>
        </TestCreationDataProvider>
        </header>
      </div>
  );
}

export default App;
