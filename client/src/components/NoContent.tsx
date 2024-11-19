import React from "react";

const NoContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="boxShadow p-6 sm:px-20 sm:py-14 flex items-center justify-center flex-col gap-[4px] rounded-xl">
            <img
                src="https://i.ibb.co/cgfgxGH/Illustrations.png"
                alt="empty/image"
                className="w-full sm:w-[200px]"
            />

            {children}
        </div>
    );
};

export default NoContent;
