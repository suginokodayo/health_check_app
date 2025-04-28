import React,{ useState } from 'react';

export const RadioGroup = ({ label, name, options, value, onChange }) =>(
    <div className="input-inner">
        <dt>{label}</dt>
        <dd>
            {options.map(opt => (
                <div className="radio-container" key={opt.value}>
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        id={`${name}_${opt.value}`}
                        className="radio-btn custom-btn"
                        onChange={onChange}
                    />
                    <label 
                        htmlFor={`${name}_${opt.value}`} 
                        className="custom-btn-text">{opt.label}
                    </label>
                </div>
            ))}
        </dd>
    </div>
);

export const NumberInput = ({ label, name, value, onChange, count }) => (
    <div className="input-inner">
        <dt>{label}</dt>
        <dd className="unit-box">
            <input 
                type="number" 
                name={name} 
                value={value} 
                className="text-input" 
                onChange={onChange} 
            />
            <p>
                {count === "minute" && "分"}
                {count === "flequency" && "回"}
            </p>
        </dd>
    </div>
);
