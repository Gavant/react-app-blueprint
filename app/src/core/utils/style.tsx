type GradientScale = `${number}px ${number}px`;

export const buildGradientScale = (count: number = 5, width: number = 45): string[] => {
    const result: GradientScale[] = [];
    let previousItem = 0;
    for (let i = 0; i < count; i++) {
        result.push(`${previousItem}px ${previousItem + width}px`);
        previousItem = previousItem + width;
    }
    return result;
};
