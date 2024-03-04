fetch('/api/reportType')
    .then(response => response.text())
    .then(type => console.log(type));

let x = text;
chartPicker(x)
function chartPicker(pick) {
switch (pick)
{
    case 1:
        dailyChart(50, 51);
        break;
    case 2:
        const months = ["January", "February", "March", "April", "May", "June"];
        const questions = [1000, 1260, 8000, 4021, 5993, 10000];
        monthlyChart(months, questions);
        break;
    case 3:
        const questionsPerHour = [80,70,6000,5504,100,6000,900,300,1000,700,8000,412,600]
        yearlyChart (questionsPerHour);
        break;
    case 4:
        durationChart();
        break;
    case 5:
        locationChart();;
        break;
    case 6:
        const mCourse =["CSCE 1301", "CJUS 2600", "CHEM 3452", "SPAN 4321", "BCIS 3610",];
        const mQuestions =[125, 100, 87, 75, 61,];
        coursesChart(mCourse, mQuestions); 
        break;
    default:
        "error"
}
}