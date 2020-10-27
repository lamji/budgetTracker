import { Bar } from 'react-chartjs-2'

export default function MonthlyChart({figuresArray, label, Month}){
    const data = {
        labels: "Montly Routes",
        labels: Month,
        datasets: [{
            label: label,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,1)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: figuresArray
        }]
    }
    return(
        <Bar data={data} />
    )
}