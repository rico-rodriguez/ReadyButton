import React, { useState, useEffect } from "react";
import ButtonClicker from "./ButtonClicker";
function DynamicComponent({ match }) {
    const { urlId } = match.params;
    return (
        <div>
            <ButtonClicker urlId={urlId} />
        </div>
    );
}

export default DynamicComponent;