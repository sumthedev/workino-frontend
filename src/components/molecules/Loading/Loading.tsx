import React from 'react'
import "./style.css"

export const Loading = () => {
    return (
        <div className='w-full h-[100vh] flex justify-center items-center'>
            <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
            </div>
        </div>
    )
}
