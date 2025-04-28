import React, { useState,useEffect } from 'react';
import Select from 'react-select';

const AnalysisSelect = ({ onSubmit, options, defaultValue = []}) => {

    const [selectedOptions, setSelectedOptions] = useState(
        options.filter(opt => defaultValue.includes(opt.value))
    );

    useEffect(() => {
        const selectedValues = selectedOptions.map(opt => opt.value);
        onSubmit(selectedValues);
    }, [selectedOptions]);

    return (
        <div className='analysis_input'>
            <div className="p-3">
                <label>表示項目を選んでください:</label>
                <Select
                    styles={{
                        control: (base) => ({ ...base, fontSize: '18px' }),
                        menu: (base) => ({ ...base, zIndex: 999 }) 
                    }}
                    placeholder="項目を選択してください"
                    options={options}
                    isMulti
                    value={selectedOptions}
                    onChange={setSelectedOptions}
                    className="mb-3"
                />
            </div>
        </div>
    );
  };
  
  export default AnalysisSelect;