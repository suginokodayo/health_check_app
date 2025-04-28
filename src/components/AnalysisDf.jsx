import React,{ useState, useEffect } from 'react';

const AnalysisDf = () => {
    const [open, setOpen] = useState(false);
    const [dfData, setDfData] = useState([]);

    const toggleTable = () => {
        setOpen(!open);
    };
    const columnOrder = [
        "year", "month", "day", "病気",
        "睡眠時間", "朝食", "昼食", "夕食",
        "運動時間", "インプット時間", "アウトプット時間",
        "風呂", "スマホ時間", "自慰回数",
        "歯磨き回数", "フロス回数", "スコア", "日記"
    ];
    useEffect(() => {
        fetch('/api/analysis_graphs')
            .then(res => res.json())
            .then(data => {
                setDfData(data.df);
            })
            .catch(err => console.error("データ取得エラー:", err));
    }, []);

    return (
        <div className="container mt-3">
            <h2>データ一覧</h2>
            <button onClick={toggleTable} className="btn btn-outline-primary mb-3">
                {open ? 'データ一覧を閉じる' : 'データ一覧を表示'}
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
                            {dfData.map((row, rowIndex) => (
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
    );
};
export default AnalysisDf;