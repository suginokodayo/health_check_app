import React,{ useState } from 'react';
import { RadioGroup, NumberInput } from './InputForm';
const DataInput = () => {
    const [formData, setFormData] = useState({
        desease: '0',
        breakfast: '0',
        lunch: '0',
        dinner: '0',
        slept_time: '0',
        sports_time: '0',
        input_time: '0',
        output_time: '0',
        bath: '0',
        smartphone_time: '0',
        masturbations: '0',
        dentifrice: '0',
        dental_floss: '0',
        journal:''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const inputList = [
        {   
            type:"radio",
            label: "病気",
            name: "desease",
            options: [
                { value: "1", label: "罹っている" },
                { value: "0", label: "罹ってない" }
            ]
        },
        {
            type:"radio",
            label: "朝食",
            name: "breakfast",
            options: [
                { value: "1", label: "食べた" },
                { value: "0", label: "食べてない" }
            ]
        },
        {   
            type:"radio",
            label: "昼食",
            name: "lunch",
            options: [
                { value: "1", label: "食べた" },
                { value: "0", label: "食べてない" }
            ]
        },
        {   
            type:"radio",
            label: "夕食",
            name: "dinner",
            options: [
                { value: "1", label: "食べた" },
                { value: "0", label: "食べてない" }
            ]
        },
        {   
            type:"radio",
            label: "風呂",
            name: "bath",
            options: [
                { value: "2", label: "入った(湯船も)" },
                { value: "1", label: "シャワーのみ" },
                { value: "0", label: "入ってない" }
            ]
        },
        {
            type:"number",
            label: "睡眠時間",
            name: "slept_time",
            count: "minute"
        },
        {
            type:"number",
            label: "スマホ時間",
            name: "smartphone_time",
            count: "minute"
        },
        {
            type:"number",
            label: "運動時間",
            name: "sports_time",
            count: "minute"
        },
        {
            type:"number",
            label: "インプット時間",
            name: "input_time",
            count: "minute"
        },
        {
            type:"number",
            label: "アウトプット時間",
            name: "output_time",
            count: "minute"
        },
        {
            type:"number",
            label: "自慰回数",
            name: "masturbations",
            count: "flequency"
        },
        {
            type:"number",
            label: "歯磨き回数",
            name: "dentifrice",
            count: "flequency"
        },
        {
            type:"number",
            label: "フロス回数",
            name: "dental_floss",
            count: "flequency"
        },
    ];
    return (
        <div className="container">        
            <form onSubmit={(e) => {
                e.preventDefault();
                fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    alert(`送信成功！スコア:${data.score}点`);
                })
                .catch(error => {
                    console.error("通信エラー:", error);
                });
            }}>
                <dl className='input-forms'>
                    {inputList.map((input, index) => {
                        const commonProps = {
                            key: index,
                            label: input.label,
                            name: input.name,
                            value: formData[input.name] || "",
                            onChange: handleChange,
                            count: input.count
                        };
                        return input.type === "radio"
                            ? <RadioGroup {...commonProps} options={input.options} />
                            : input.type === "number"
                                ? <NumberInput {...commonProps} />
                                : null;
                    })}
                    <div className="input-inner">
                        <dt>日記</dt>
                        <dd className="unit-box">
                            <textarea name="journal" value={formData.journal} onChange={handleChange}/>
                        </dd>
                    </div>
                </dl>
                <button name="submit" type="submit" className="next-btn">提出</button>
            </form>
        </div>
    );
};

export default DataInput;