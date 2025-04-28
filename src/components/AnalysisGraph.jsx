import React,{ useState, useEffect } from 'react';
import AnalysisSelect from './AnalysisSelect';
import Plot from "react-plotly.js";


const options = [
    { value: "スマホ時間", label: "スマホ時間" },
    { value: "自慰回数", label: "自慰回数" },
    { value: "歯磨き回数", label: "歯磨き回数" },
    { value: "フロス回数", label: "フロス回数" },
    { value: "朝食", label: "朝食" },
    { value: "昼食", label: "昼食" },
    { value: "夕食", label: "夕食" },
    { value: "風呂", label: "風呂" },
    { value: "睡眠時間", label: "睡眠時間" },
    { value: "運動時間", label: "運動時間" },
    { value: "アウトプット時間", label: "アウトプット時間" },
    { value: "インプット時間", label: "インプット時間" },
    { value: "スコア", label: "スコア" }
];
  
const AnalysisGraph = () => {
    const [selectedItems, setSelectedItems] = useState(["スコア"]);
    const [plotData, setPlotData] = useState(null); 
    const [group, setGroup] = useState("daily");// グラフ_urlをFlaskから取得する
    
    useEffect(() => {
        if (selectedItems.length === 0) return;
        const query = selectedItems.map(item => `item=${encodeURIComponent(item)}`).join("&");
        fetch(`/api/analysis_graphs?${query}&group=${group}`)
            .then(res => res.json())
            .then(data => {
                const parsedGraph = JSON.parse(data.graph_json);
                setPlotData({
                    data: parsedGraph.data,
                    layout: parsedGraph.layout
                });
                setGroup(data.group);
            })
        .catch(err => console.error("データ取得エラー:", err));
    }, [selectedItems, group]);
    

    return(
        <div className="graph-list">
            <div className="container">
                <AnalysisSelect
                    options={options} 
                    onSubmit={setSelectedItems}
                    defaultValue={["スコア"]}
                />
                <div className="graph-custom">
                    <div className="container mt-4">
                    <h2>
                        {selectedItems.join(", ")} の
                        {group === "daily" ? "推移" : "平均の推移"} ({group})
                    </h2>
                        {plotData ? (
                            <Plot
                                data={plotData.data}
                                layout={plotData.layout}
                                useResizeHandler
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : (
                            <p>グラフを読み込み中...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisGraph;
