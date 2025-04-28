import React,{ useState, useEffect } from 'react';



const AnalysisResults = () => {
    const [open, setOpen] = useState(false);
    const [ResultData, setResultData] = useState([]);
    const toggleTable = () => {
            setOpen(!open);
    };

    const columnOrder = [
        "変数名","最大値","最小値","平均","中央値","最頻値","目標達成率(%)","標準偏差"
    ];

    useEffect(() => {
        fetch('/api/analysis')
            .then(res => res.json())
            .then(data => {
                const keys = Object.keys(data);
                const rowCount = Object.values(data[keys[0]]).length;

                const rows = Array.from({ length: rowCount }, (_, idx) => {
                    const row = {};
                    keys.forEach(key => {
                        row[key] = data[key][idx];
                    });
                    return row;
                });
                setResultData(rows);
            })
            .catch(err => console.error("データ取得エラー:", err));
    }, []);
    return(
        <div className='container analysis_results'>
            <div className='simple_analysis'>
                    <h2>簡易分析</h2>
                    <button onClick={toggleTable} className="btn btn-outline-primary mb-3">
                        {open ? '結果一覧を閉じる' : '結果一覧を表示'}
                    </button>
                    {open && (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        {columnOrder.map((col, idx) => (
                                            <th key={idx}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ResultData.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {columnOrder.map(col => (
                                            <td key={col}>
                                                {/* nullやundefinedは空文字に置換して表示 */}
                                                {row[col] === null || row[col] === undefined ? '' : row[col]}
                                            </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>
            <div class="analysis">
                <h2>分析</h2>

            </div>
        </div>
    )
}
export default AnalysisResults;