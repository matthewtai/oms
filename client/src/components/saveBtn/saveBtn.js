import React from 'react';
import './saveBtn.css';


function SaveBtn(props) {

    return  (
        <div>
            <button 
                onClick={()=>props.handleStageSubmit()}
                >
                Save
            </button>
        </div>
    );
}

export default SaveBtn;