import React,{ useState, useEffect } from 'react';
import { RadioGroup, NumberInput } from './InputForm';
const GoalInput = () => {

    const [formData, setFormData] = useState({
        sleeptime_goal: '0',
        exercisetime_goal: '0',
        inputtime_goal: '0',
        outputtime_goal: '0',
        //bath: '',
        smartphone_limit: '0',
        masturbation_limit: '0',
        dentifrice_goal: '0',
        dentalfloss_goal: '0'
    });

    useEffect(() => {
        fetch('/api/goal')
            .then(res => res.json())
            .then(data => {
                setFormData(data);
            })
            .catch(err => console.error("初期データ取得エラー:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const inputList = [
        {
            type:"number",
            label: "睡眠時間",
            name: "sleeptime_goal",
            count: "minute"
        },
        {
            type:"number",
            label: "スマホ時間",
            name: "smartphone_limit",
            count: "minute"
        },
        {
            type:"number",
            label: "運動時間",
            name: "exercisetime_goal",
            count: "minute"
        },
        {
            type:"number",
            label: "インプット時間",
            name: "inputtime_goal",
            count: "minute"
        },
        {
            type:"number",
            label: "アウトプット時間",
            name: "outputtime_goal",
            count: "minute"
        },
        {
            type:"number",
            label: "自慰回数",
            name: "masturbation_limit",
            count: "flequency"
        },
        {
            type:"number",
            label: "歯磨き回数",
            name: "dentifrice_goal",
            count: "flequency"
        },
        {
            type:"number",
            label: "フロス回数",
            name: "dentalfloss_goal",
            count: "flequency"
        },
    ];
    return (
        <div className="container">        
            <form onSubmit={(e) => {
                e.preventDefault();
                fetch('/api/save_goal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }).then(response => {
                    if (response.ok) alert("変更完了！");
                });
            }}>
                <dl className='input-forms'>
                    {inputList.map((input, index) => {
                        const commonProps = {
                            key: index,
                            label: input.label,
                            name: input.name,
                            value: formData[input.name] ?? "",
                            onChange: handleChange,
                            count: input.count
                        };
                        return input.type === "radio"
                            ? <RadioGroup {...commonProps} options={input.options} />
                            : input.type === "number"
                                ? <NumberInput {...commonProps} />
                                : null;
                    })}
                </dl>
                <button name="submit" type="submit" className="next-btn">保存</button>
            </form>
        </div>
    );
};

export default GoalInput;