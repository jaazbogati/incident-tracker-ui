 export const getSeverityColor = (severity) => {
        switch (severity) {
            case "Low":
                return "#4CAF50";
            case "Medium":
                return "#FFC107";
            case "High":
                return "#FF9800";
            case "Critical":
                return "#F44336";
            default:
                return "#9E9E9E";
        }
    };