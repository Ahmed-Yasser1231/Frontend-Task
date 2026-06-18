// Modal component with two action buttons

import React from 'react'

const Modal = (
    {
        show,
        setShow,
        title,
        save,
        cancel,
        children
    }
) => {
    return (
        <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3 sm:p-6 ${show ? '' : 'hidden'}`}>
            <div className="w-full max-w-[32rem] overflow-hidden rounded-2xl bg-white shadow-2xl">
                <h2 className="mb-4 bg-main p-4 text-base sm:text-lg font-semibold text-white">{title}</h2>
                <div className='flex flex-col items-stretch justify-center w-full gap-4 p-4 font-light'> 

               {children}
               </div>
                <div className="flex flex-col-reverse gap-3 p-4 font-light sm:flex-row sm:justify-end">
                    
                    <button
                        onClick={cancel}
                        className="text-main border border-main bg-white px-3 py-2 rounded w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={save}
                        className="bg-main text-white px-3 py-2 rounded w-full sm:w-auto"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal