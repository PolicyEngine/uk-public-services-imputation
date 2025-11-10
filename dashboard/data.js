// Public services spending data by income decile
// Auto-generated from dashboard_data.csv

// Teal color scheme
const TEAL_COLORS = [
    '#319795',  // NHS - Core teal
    '#2C7A7B',  // Education - Dark teal
    '#81E6D9',  // Rail subsidy - Light teal
    '#4FD1C5'   // Bus subsidy - Medium teal
];

const incomeDeciles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const chartData = [
    {
        name: 'NHS',
        x: incomeDeciles,
        y: [7047.68, 7850.58, 8059.67, 7946.61, 7868.74, 7404.91, 6654.77, 6044.79, 5397.61, 4270.67],
        type: 'bar',
        marker: { color: TEAL_COLORS[0] },
        hovertemplate: '<b>NHS</b><br>Decile: %{x}<br>Spending: £%{y:,.0f}<extra></extra>'
    },
    {
        name: 'Education',
        x: incomeDeciles,
        y: [9670.56, 7164.65, 4512.4, 2661.02, 1378.32, 1098.72, 675.36, 444.41, 252.36, 149.19],
        type: 'bar',
        marker: { color: TEAL_COLORS[1] },
        hovertemplate: '<b>Education</b><br>Decile: %{x}<br>Spending: £%{y:,.0f}<extra></extra>'
    },
    {
        name: 'Rail subsidy',
        x: incomeDeciles,
        y: [973.91, 786.82, 890.34, 713.92, 278.41, 510.72, 305.6, 518.47, 790.6, 1327.28],
        type: 'bar',
        marker: { color: TEAL_COLORS[2] },
        hovertemplate: '<b>Rail subsidy</b><br>Decile: %{x}<br>Spending: £%{y:,.0f}<extra></extra>'
    },
    {
        name: 'Bus subsidy',
        x: incomeDeciles,
        y: [195.31, 171.12, 143.17, 133.43, 148.68, 102.11, 102.67, 119.72, 87.58, 68.78],
        type: 'bar',
        marker: { color: TEAL_COLORS[3] },
        hovertemplate: '<b>Bus subsidy</b><br>Decile: %{x}<br>Spending: £%{y:,.0f}<extra></extra>'
    }
];
