import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import DataInput from './DataInput';
import GoalInput from './GoalInput';
import AnalysisGraph from './AnalysisGraph';
import AnalysisDf from './AnalysisDf';
import AnalysisResults from './AnalysisResults';
import Footer from './Footer';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<DataInput />} />
                    <Route path="/analysis" element={
                        <div>
                            <AnalysisGraph />
                            <AnalysisDf/>
                            <AnalysisResults/>
                        </div>
                    } />
                    <Route path="/goal" element={<GoalInput />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;